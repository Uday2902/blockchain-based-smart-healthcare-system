const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
// MongoDB Atlas Connection URI
const dbURI = 'mongodb+srv://code-quick-backend:ft3bYrVwjWqc6qV8@blog-app-cluster.crfrsjc.mongodb.net/';

// Connect to MongoDB Atlas
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define the patient schema
const patientSchema = new mongoose.Schema({
    hash: { type: String, required: true }
});

// Define the doctor schema
const doctorSchema = new mongoose.Schema({
    hash: { type: String, required: true }
});

// Create models for patients and doctors
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

// Route to add a new patient hash
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

// Route to add a new doctor hash
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

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
