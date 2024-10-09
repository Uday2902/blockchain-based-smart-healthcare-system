import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import { strings } from '@helia/strings'
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import path from 'path';
import { verifiedFetch } from '@helia/verified-fetch';
import { CID } from 'multiformats/cid';

import EventEmitter from "events";

let cidGlobal = null;

const app = express();
app.use(express.json());
app.use(cors());

const emitter = new EventEmitter();
emitter.setMaxListeners(40);

const dbURI = 'mongodb+srv://code-quick-backend:ft3bYrVwjWqc6qV8@blog-app-cluster.crfrsjc.mongodb.net/';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const patientSchema = new mongoose.Schema({
    hash: { type: String, required: true }
});

const doctorSchema = new mongoose.Schema({
    hash: { type: String, required: true }
});

const reportsSchema = new mongoose.Schema({
    userHash: { type: String, required: true },
    reportsHashes: [
        { type: String, required: true }
    ]
});


const helia = await createHelia()
const s = strings(helia)

const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Reports = mongoose.model('Report', reportsSchema);

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|txt/;  // Include txt explicitly here
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'text/plain';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images, PDFs, and .txt files are allowed!');
    }
}

const convertHashToCID = (ipfsHash) => {
    const cid = CID.parse(ipfsHash);
    return cid;
};


app.get('/get-files', async (req, res) => {
    const { user } = req.body;
    const userData = await Reports.findOne({ userHash: user });
    const fileHashes = [];
    fileHashes = userData.reportsHashes;
    console.log("Files -> ", fileHashes);
    let files = [];
    for (let fileHash in fileHashes) {
        const file = await getFile(fileHash);
        files.push(file);
    }
    console.log("Files -> ", files)
    res.status(200).send(files);
});

app.post('/upload', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file selected!');
    }

    try {
        const user = req.body.user;
        console.log("User -> ", user);

        // const helia = await createHelia();
        // const fs = strings(helia);

        const fileContent = req.file.buffer.toString('utf-8');
        console.log("File Content -> ", fileContent);

        const cid = await s.add(fileContent);
        const fileHash = cid.toString();

        console.log("Uploaded CID -> ", fileHash);

        let reportEntry = await Reports.findOne({ userHash: user });
        if (reportEntry) {
            reportEntry.reportsHashes.push(fileHash);
            await reportEntry.save();
        } else {
            const newReport = new Reports({
                userHash: user,
                reportsHashes: [fileHash]
            });
            await newReport.save();
        }

        res.send(`File uploaded successfully. Hash: ${fileHash}`);
    } catch (error) {
        console.error('Error uploading file to IPFS or saving to database:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});





// app.post('/upload', async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             console.error('Multer error:', err);
//             return res.status(400).send(err.message);
//         }
//         if (!req.file) {
//             return res.status(400).send('No file selected!');
//         }

//         try {
//             const user = req.body.user;
//             console.log("User -> ", user);

//             const helia = await createHelia();
//             const fs = unixfs(helia);
//             const fileContent = req.file.buffer;
//             const cid = await fs.addBytes(fileContent);
//             const fileHash = cid.toString();
//             let reportEntry = await Reports.findOne({ userHash: user });

//             if (reportEntry) {
//                 reportEntry.reportsHashes.push(fileHash);
//                 await reportEntry.save();
//             } else {
//                 const newReport = new Reports({
//                     userHash: user,
//                     reportsHashes: [fileHash]
//                 });
//                 await newReport.save();
//             }

//             res.send(`File uploaded successfully. Hash: ${fileHash}`);
//         } catch (error) {
//             console.error('Error uploading file to IPFS or saving to database:', error);
//             res.status(500).send(`Error: ${error.message}`);
//         }
//     });
// });




app.post('/testing-get', async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).send(err.message);
        }
        if (!req.file) {
            return res.status(400).send('No file selected!');
        }

        try {
            const user = req.body.user;
            console.log("User -> ", user);
            const fileContent = req.file.buffer.toString('utf-8');
            console.log("File content -> ", fileContent);
            const helia = await createHelia()
            const s = strings(helia)
            const cid = await s.add('hello world')
            res.status(200).json({ cid });
        } catch (error) {
            console.error('Error uploading file to IPFS or saving to database:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
});


app.post('/testing-get-text', async (req, res) => {
    const { cid } = req.body;
    console.log("cid -> ", cid)
    const helia = await createHelia()
    const s = strings(helia)
    let ans = await s.get(cid);
    console.log("fetching data -> ", ans);
    res.status(200).send({ text: ans, cid });

})

app.get('/here-sab-chalta-hai', async (eq, res) => {

    const myImmutableAddress = await s.add('hello world')

    console.log("myImmutableAddress -> ", myImmutableAddress);
    cidGlobal = myImmutableAddress;
    console.log(await s.get(myImmutableAddress))
    // hello world

    res.send(myImmutableAddress);
})


app.post('/here-kuch-nahi-chalta', async (req, res) => {
    let { cid } = req.body;
    cid = convertHashToCID(cid);
    console.log("Converted cid -> ", cid);
    // cid = cid.toString();
    // let cid = {
    //     "/": "bafkreifzjut3te2nhyekklss27nh3k72ysco7y32koao5eei66wof36n5e"
    // }
    // const myImmutableAddress = await s.add('hello world')

    console.log(await s.get(cid));
    res.send("waah jordar bagdyo");
})



// app.post('/testing-get', upload.single('file'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         if (req.file.mimetype
//             !== 'text/plain') {
//             return res.status(415).json({ error: 'Only .txt files allowed' });
//         }

//         // Read the text content from the uploaded file
//         const fileContent = req.file.buffer.toString('utf-8');

//         // Create a Helia instance and access the UnixFS module
//         const helia = await createHelia();
//         const fsHelia = unixfs(helia);

//         // Upload the text content to IPFS
//         const cid = await fsHelia.add(fileContent);

//         // Send the CID back as a response
//         res.status(200).json({ cid });
//     } catch (error) {
//         console.error('Error processing file:', error);
//         res.status(500).json({ error: 'Failed to process file' });
//     }
// });




/*app.get('/testing-get', async (req, res) => {
    let cid = "bafkreigs67uqlxtmp5z7egusmaocn5snozulnm6ucpxartpszyhsty4hfi"
    let cid2 = "bafkreigjc5tna7ltimr7shwbg6fs7p2r6u24mgbc7uiwjaoe5pq4bsaoe4"
    let cid3 = "bafkreigjc5tna7ltimr7shwbg6fs7p2r6u24mgbc7uiwjaoe5pq4bsaoe4";
    // verifiedFetch(cid)
    //     .then(response => response.arrayBuffer())
    //     .then(data => {
    //         console.log("Fetched data:", data);
    //     })
    //     .catch(error => {
    //         console.error("Error fetching data:", error);
    //     });


    try {


        // const response = await verifiedFetch(cid3);
        // const data = await response.arrayBuffer();
        // console.log("Data -> ", data);

        // const filePath = path.join("files", 'fetchedData.png')
        // const response = await verifiedFetch(cid3);
        // const data = await response.arrayBuffer();
        // console.log(data);
        // const buffer = Buffer.from(data);
        // console.log("Buffer -> ", buffer);
        // res.set('Content-Type', 'application/octet-stream');
        // res.send(buffer);


        // fs.writeFile(filePath, buffer, (err) => {
        //     if (err) {
        //         console.error("Error writing file:", err);
        //         return res.status(500).send("Error writing file");
        //     }

        //     console.log("File saved successfully:", filePath);
        //     res.download(filePath, 'fetchedData.bin', (err) => {
        //         if (err) {
        //             console.error("Error sending file:", err);
        //         }
        //     });
        // });

        const helia = await createHelia();
        const fsHelia = unixfs(helia);

        const fileContent = await fsHelia.cat(cid);

        // Method 1: Using a loop
        let pdfData = [];
        for await (const chunk of fileContent) {
            pdfData.push(chunk);
        }
        const pdfContent = Buffer.concat(pdfData);
        console.log("PDF CONTENT -> ", pdfContent)
        // Method 2: Using Array.from()
        // const pdfContent = Buffer.concat(Array.from(fileContent));

        console.log('PDF Content:', pdfContent)
        res.set('Content-Type', 'application/pdf');
        res.send(fileContent);


    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }

})


*/







app.post('/patients', async (req, res) => {
    const { hash } = req.body;
    const patient = new Patient({ hash });

    try {
        const savedPatient = await patient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/doctors', async (req, res) => {
    const { hash } = req.body;
    const doctor = new Doctor({ hash });

    try {
        const savedDoctor = await doctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/search', async (req, res) => {
    try {
        const { hash } = req.body;
        console.log("hash -> ", hash);

        let user = await Patient.findOne({ hash });
        console.log("User1 -> ", user);
        if (user) {
            return res.status(200).send({ ...user.toObject(), userType: "Patient" });
        }

        user = await Doctor.findOne({ hash });
        console.log("User2 -> ", user);
        if (user) {
            return res.status(200).send({ ...user.toObject(), userType: "Doctor" });
        }

        return res.status(404).send({ err: "User not found!" });
    } catch (error) {
        console.error("Error while searching for user:", error);
        return res.status(500).send({ err: "Internal Server Error" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});
