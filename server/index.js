import express from 'express';
import mongoose from 'mongoose';
import ipfsAPI from 'ipfs-api';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

import EventEmitter from "events";

const app = express();
app.use(express.json());
app.use(cors());

const emitter = new EventEmitter();
emitter.setMaxListeners(40);

const ipfs = ipfsAPI('localhost', 5001, { protocol: 'http' });

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
        {
            fileHash: { type: String, required: true },
            extension: { type: String, required: true },
            fileName: { type: String, required: true },
        }
    ]
});

const IPFSSchema = new mongoose.Schema({
    hash: { type: String, required: true }
});


const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Reports = mongoose.model('Report', reportsSchema);
const IPFS = mongoose.model('IPFS', IPFSSchema);

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, (err, result) => {
            if (err) {
                cb(err); // Handle error from checkFileType
            } else if (result.valid) {
                req.fileExtension = result.extension;
                req.fileName = result.fileName
                cb(null, true); // Proceed with file upload
            } else {
                cb('Error: Invalid file type!');
            }
        });
    }
}).single('file');


async function getFileDataFromIPFS(cid) {
    console.log("cid inside -> ",cid);
    const file = await ipfs.get(cid);
    console.log("File inside -> ",file);
    const fileData = file[0].content;
    console.log("File data inside -> ", fileData);
    return fileData;
}

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf|txt/;
    const fileName = file.originalname;
    console.log("Filename -> ", fileName);
    const extension = path.extname(file.originalname).toLowerCase(); // Get file extension
    const extname = filetypes.test(extension);

    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'text/plain';

    if (mimetype && extname) {
        return cb(null, { valid: true, extension, fileName }); // Return both valid flag and extension
    } else {
        cb('Error: Only images, PDFs, and .txt files are allowed!');
    }
}


app.post('/get-files', async (req, res) => {
    try {
        const { user } = req.body;
        const userData = await Reports.findOne({ userHash: user });
        const fileHashes = userData.reportsHashes;
        
        let files = [];

        for (let item of fileHashes) {
            const fileData = await getFileDataFromIPFS(item.fileHash);
            const base64File = fileData.toString('base64');
            const extension = item.extension;

            files.push({
                data: base64File,
                fileName: `${item.fileName}`,
                fileType: `application/${extension}`,
                fileHash: item.fileHash
            });
        }

        res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Error fetching files');
    }
});

app.post('/get-file', async (req, res) => {
    try{
        const { user } = req.body;

    }catch(err){

    }


});

app.post('/upload', upload, async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file selected!');
    }

    try {
        const user = req.body.user;
        console.log("User -> ", user);

        const fileBuffer = req.file.buffer;
        
        const added = await ipfs.add(fileBuffer);
        const cid = added[0].hash;
        console.log("File Content -> ", fileBuffer);
        console.log("File CID -> ", cid);

        let reportEntry = await Reports.findOne({ userHash: user });
        if (reportEntry) {
            reportEntry.reportsHashes.push({fileHash: cid, extension: req.fileExtension, fileName: req.fileName});
            await reportEntry.save();
        } else {
            const newReport = new Reports({
                userHash: user,
                reportsHashes: [{
                    fileHash: cid,
                    extension: req.fileExtension,
                    fileName: req.fileName
                }]
            });
            const newIPFS = new IPFS({hash: cid})
            await newIPFS.save();
            await newReport.save();
        }

        res.send(`File uploaded successfully. Hash: ${cid}`);
    } catch (error) {
        console.error('Error uploading file to IPFS or saving to database:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

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

app.get('/doctors-list', async (req, res) => {
    try{
        const doctors = await Doctor.find({});
        if(doctors){
            return res.status(200).send(doctors);
        }else{
            return res.status(200).send({message: "No doctors found!"});
        }
    }catch(err){
        console.log("Error while fetching doctors list : ", err);
        return res.status(500).send({err: "Error while fetching doctors list"});
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
