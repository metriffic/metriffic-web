import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import { metriffic_client } from './metriffic_gql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// Handle GET requests to /api route
app.get("/api", async (req, res) => {
    const all_platforms_gql = gql`{ 
        allPlatforms { id name description } 
    }`;
    const all_platforms = await metriffic_client.makeRequest(all_platforms_gql);

    console.log(JSON.stringify(all_platforms.data));

    res.json({ message: "Hello from server!" });

});
  

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
