import express from 'express';
import path from 'path';
import cors from 'cors';
import nodeMailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import {fileURLToPath} from 'url';
import { metriffic_client } from './metriffic_gql.js';
import gql from 'graphql-tag';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

const authenticate_token = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, config.AUTHENTICATION_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // User is now authenticated
        next();
    });
}


const rate_limiter = () => {
    // Store IP addresses and their request timestamps
    const request_map = new Map();
    const WINDOW_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 5;      // 5 requests per minute
  
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        // Get or initialize request history for this IP
        if (!request_map.has(ip)) {
            request_map.set(ip, []);
        }
    
        const requests = request_map.get(ip);
    
        // Remove requests outside the current time window
        const valid_requests = requests.filter(
            timestamp => now - timestamp < WINDOW_MS
        );
        // Check if request limit is exceeded
        if (valid_requests.length >= MAX_REQUESTS) {
            return res.status(429).json({
                status: 'failure',
                message: 'too many requests, please try again later',
                retryAfter: Math.ceil((valid_requests[0] + WINDOW_MS - now) / 1000)
            });
        }
        // Add current request timestamp
        valid_requests.push(now);
        request_map.set(ip, valid_requests);
    
        // Clean up old entries periodically
        if (Math.random() < 0.1) { // 10% chance to clean up on each request
            for (const [key, timestamps] of request_map.entries()) {
            const valid_timestamps = timestamps.filter(
                timestamp => now - timestamp < WINDOW_MS
            );
            if (valid_timestamps.length === 0) {
                request_map.delete(key);
            } else {
                request_map.set(key, valid_timestamps);
            }
            }
        }
        next();
    };
}


const app = express();
//app.use(rate_limiter());
app.use(express.json());
app.use(cors());

// https://medium.com/@bluedesk09/sending-email-with-zoho-nodejs-nodemailer-62de7fffc8ac
const transporter = nodeMailer.createTransport({
    host: 'smtp.zoho.com',
    secure: true,
    port: 465,
    auth: {
      user: 'agent@metriffic.com',
      pass: config.WEB_CLIENT_EMAIL_PASSWORD,
    },
});
 
const generate_token = (user) => {
    const sign_options = {
        //issuer:  i,
        //subject:  s,
        //audience:  a,
        //algorithm:  AUTH_ALGORITHM,
        expiresIn:  "24h",
       };
    return jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    user_key: user.userKey,
                    role: user.role,
                }, 
                config.AUTHENTICATION_SECRET, 
                sign_options
            );
}



app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.post('/signup', rate_limiter(), async (req, res) => {
    const mail_options = {
        from: 'agent@metriffic.com',
        to: 'vazkus@yahoo.com',
        subject: 'Requesting access to Metriffic service', 
        html: `<p>Got a beta signup request from:</p>
               <p style="margin-bottom:0px">  username: <b>${req.body.username}</b></p>
               <p>  email:    <b>${req.body.email}</b></p>`
    };
    await transporter.sendMail(mail_options, (err, info) => {
        if (err) {
            console.log('Error when sending an email...');
        } else {
            console.log('Successfully sent an email requesting access...');
        }
      });
    res.json({ message: "email sent!" });
})

app.post('/send_otp', rate_limiter(), async (req, res) => {
    const {username} = req.body;
    
    // const all_platforms_gql = gql`{ 
    //     allPlatforms { id name description } 
    // }`;
    // const all_platforms = await metriffic_client.gql.query({
    //                             query: all_platforms_gql
    //  
    //console.log('LOGIN', JSON.stringify(all_platforms.data));

    const code = otpGenerator.generate(12, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
        digits: true,
      });

    try {
        // 10 min from now
        const expiry_sec = Math.floor((Date.now() + 600000) / 1000);
        const mutation_variables = {
            username: username,
            otp: code,
            expiry: expiry_sec,
        };
        const mutation_save_otp = gql`
            mutation SaveOtp($username: String!, $otp: String!, $expiry: Int!) {
                saveOTP(username: $username, otp: $otp, expiry: $expiry) 
                {
                    status
                    email
                    message
                }
            }`;
        const save_otp_result = await metriffic_client.gql.mutate({
                mutation: mutation_save_otp,
                variables: mutation_variables
            });

        if (save_otp_result.data.saveOTP.status) {
            const mail_options = {
                from: 'agent@metriffic.com',
                to: save_otp_result.data.saveOTP.email,
                subject: 'OTP to complete your signin',
                html: `<p style="font-size:1em">
                         Please use the below OTP code to complete your account login on Metriffic:
                         <div style="color:blue; font-size:1.2em"/><b>${code}</b></div></p>`,
            };
            await transporter.sendMail(mail_options, (err, info) => {
                if (err) {
                    console.log('Error when sending an email...');
                } else {
                    console.log('Successfully sent an email requesting access...');
                }
            });
            return res.json({ status: 'success', message: 'OTP has been generated and sent to the provided email.' });
        } else {
            return res.json({ status: 'failed', message: save_otp_result.data.saveOTP.message });
        }
    } catch (error) {
        console.error(error);
        return res.json({ status: 'failed', message: 'failed to generate/send the OTP... (invalid user?).' });
    }
});

app.post('/verify_otp', rate_limiter(), async (req, res) => {
    const { username, otp } = req.body;

    try {
        // Call GraphQL query to verify OTP
        const query_variables = { username, otp };
        const query_verify_otp = gql`
        query VerifyOtp($username: String!, $otp: String!) {
            verifyOTP(username: $username, otp: $otp) 
            { 
                status 
                message
                user {
                    username
                    email
                    role
                    bastionKey
                    userKey
                }
            }
        }`;
        //            verifyOTP(username: $username, otp: $otp) { username email role bastionKey userKey }
        const verify_otp_result = await metriffic_client.gql.query({
                                         query: query_verify_otp,
                                         variables: query_variables
                                    });

        if (verify_otp_result.data.verifyOTP.status) {
            const authuser = {...verify_otp_result.data.verifyOTP.user};
            authuser.token = generate_token(authuser);
            return res.json({ status: 'success', user: authuser, message: 'successfully logged in.' });
        } else {
            return res.json({ status: 'failed', message: verify_otp_result.data.verifyOTP.message });
        }
    } catch (error) {
        console.error(error);
        return res.json({ status: 'failed', message: 'unable to verify the OTP.' });
    }
});

app.post('/save_user_profile', rate_limiter(), authenticate_token, async (req, res) => {
    const { username, bastion_key, user_key } = req.body;

    try {
        const mutation_variables = {
            username: username,
            bastion_key: bastion_key,
            user_key: user_key
        };        
        const mutation_save_user_profile = gql`
            mutation SaveKeys($username: String!, $bastion_key: String!, $user_key: String!) {
                saveKeys(username: $username, bastionKey: $bastion_key, userKey: $user_key) 
                {
                        username
                        email
                        role
                        bastionKey
                        userKey
                }
            }`;
        const save_user_profile_result = await metriffic_client.gql.mutate({
                mutation: mutation_save_user_profile,
                variables: mutation_variables
            });

        if (save_user_profile_result.data.saveKeys) {
            return res.json({ status: 'success', user: save_user_profile_result.data.saveKeys, message: 'successfully saved the keys.' });
        } else {
            return res.json({ status: 'failed', message: save_user_profile_result.data.saveKeys.message });
        }
    } catch (error) {
        console.error(error);
        return res.json({ status: 'failed', message: 'unable to save user profile.' });
    }
});

app.get('/download_metriffic_cli', rate_limiter(), (req, res) => {
	const file_path = '../downloads/metriffic-cli.tar.gz';
    res.download(file_path); 
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
