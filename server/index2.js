import express from 'express';
import { createHelia } from "helia";
import multer from 'multer';

const app = express();
const port = 3000;

// Configure Helia client
const helia = new createHelia({
    host: 'https://ipfs.infura.io',
    port: 5001
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads', // Temporary storage for uploaded files
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

// Define the endpoint to upload files
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Add the file to IPFS using Helia
        const file = await helia.add(req.file.path);

        // Return the IPFS hash
        res.json({ hash: file.cid.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload file to IPFS' });
    }
});

// Define the endpoint to retrieve files
app.get('/get/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;

        // Retrieve the file using the CID
        const file = await helia.cat(cid);

        // Stream the file content as a response
        file.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve file from IPFS' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});