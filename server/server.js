import express from 'express';
import path from 'path';
import cors from 'cors';
import nodeMailer from 'nodemailer';
import otpGenerator from 'otp-generator';

import {fileURLToPath} from 'url';
import { metriffic_client } from './metriffic_gql.js';
import gql from 'graphql-tag';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const PORT = process.env.PORT || 8000;

const app = express();
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


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.post('/request_access', async (req, res) => {
    console.log('REQUEST_ACCESS BODY', req.body)
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

app.post('/send_otp', async (req, res) => {
    const {username} = req.body;
    console.log('LOGIN BODY', username)

    // const all_platforms_gql = gql`{ 
    //     allPlatforms { id name description } 
    // }`;
    // const all_platforms = await metriffic_client.gql.query({
    //                             query: all_platforms_gql
    //  
    //console.log('LOGIN', JSON.stringify(all_platforms.data));

    const code = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
        digits: true,
      });

    const mail_options = {
        from: 'agent@metriffic.com',
        to: 'vazkus@yahoo.com',
        subject: 'OTP to complete your signin',
        html: `<p style="font-size:1em">
                 Please use the below OTP code to complete your account login on Metriffic</p>
               <p style="color:blue; font-size:1.2em"><b>${code}</b></p>`,
    };

    try {
        await transporter.sendMail(mail_options, (err, info) => {
            if (err) {
                console.log('Error when sending an email...');
            } else {
                console.log('Successfully sent an email requesting access...');
            }
        });

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
                    message
                }
            }`;
        const save_otp_result = await metriffic_client.gql.mutate({
                mutation: mutation_save_otp,
                variables: mutation_variables
            });
        console.log('SAVE OTP', save_otp_result)
        if (save_otp_result.data.saveOTP.status) {
            return res.json({ status: 'success', message: 'OTP has been sent to the provided email.' });
        } else {
            return res.json({ status: 'failed', message: save_otp_result.data.saveOTP.message });
        }
    } catch (error) {
        console.error(error);
        return res.json({ status: 'failed', message: 'Unable to send email or save OTP at the moment.' });
    }
});


app.post('/verify_otp', async (req, res) => {
    const { username, otp } = req.body;
    console.log('VERIFY', username, otp)

    try {
        // Call GraphQL query to verify OTP
        const query_variables = { username, otp };
        const query_verify_otp = gql`
        query VerifyOtp($username: String!, $otp: String!) {
            verifyOTP(username: $username, otp: $otp) 
            {
                status
                message
            }
        }`;
        const verify_otp_result = await metriffic_client.gql.query({
                                         query: query_verify_otp,
                                         variables: query_variables
                                    });

        console.log('VERIFY OTP', verify_otp_result);
        if (verify_otp_result.data.verifyOTP.status) {
            return res.json({ status: 'success', message: 'successfully logged in.' });
        } else {
            return res.json({ status: 'failed', message: verify_otp_result.data.verifyOTP.message });
        }
    } catch (error) {
        console.error(error);
        return res.json({ status: 'failed', message: 'unable to verify the OTP.' });
    }
  });

// Handle GET requests to /api route
app.get("/api", async (req, res) => {
    console.log(JSON.stringify(all_platforms.data));
    res.json({ message: "Hello from server!" });
});
  

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
