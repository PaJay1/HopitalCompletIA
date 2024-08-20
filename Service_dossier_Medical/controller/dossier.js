const axios = require('axios');
const Appointment = require('../models/dossier');

const getUserDetails = async (userId, token) => {
  try {
    console.log(`Fetching user details for ID: ${userId}`);
    const response = await axios.get(`http://localhost:5000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utilisation du token JWT
      }
    });

    // Ajout d'un log pour la structure de la réponse
    console.log(`Response from API: ${JSON.stringify(response.data)}`);

    return response.data; // Assure-toi que response.data contient ce que tu veux
  } catch (error) {
    console.error(`Error fetching user details: ${error.message}`);
    throw new Error('Error fetching user details: ' + error.message);
  }
};

exports.ajouterDossier = async (req, res) => {
  const { patientId, doctorId, antecedant, diagnostic, traitement } = req.body;

  console.log(`Request body: ${JSON.stringify(req.body)}`); // Log pour vérifier req.body

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  const token = req.headers.authorization.split(' ')[1]; // Récupérer le token du header
  console.log(`Authorization token: ${token}`); // Log pour vérifier le token

  if (!patientId || !doctorId || !antecedant || !diagnostic || !traitement) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    const patient = await getUserDetails(patientId, token);
    const doctor = await getUserDetails(doctorId, token);

    // Vérifie ce qui est retourné par getUserDetails
    console.log(`Patient details: ${JSON.stringify(patient)}`);
    console.log(`Doctor details: ${JSON.stringify(doctor)}`);

    if (!patient || !doctor) {
      return res.status(404).send({ message: 'Patient or Doctor not found' });
    }

    const newDossier = new Appointment({ patientId, doctorId, antecedant, diagnostic, traitement });
    await newDossier.save();
    res.status(201).send(newDossier);
  } catch (error) {
    console.error(`Error during dossier creation: ${error.message}`);
    res.status(500).send({ message: 'Error creating appointment: ' + error.message });
  }
};

exports.getMedicalRecordsByPatient = async (req, res) => {
  const { patientId } = req.params;

  console.log(`Patient ID from params: ${patientId}`); // Log pour vérifier req.params

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  const token = req.headers.authorization.split(' ')[1]; // Récupérer le token du header
  console.log(`Authorization token: ${token}`); // Log pour vérifier le token

  try {
    const medicalRecords = await Appointment.find({ patientId });

    console.log(`Medical records found: ${JSON.stringify(medicalRecords)}`); // Log pour vérifier les données récupérées

    if (!medicalRecords || medicalRecords.length === 0) {
      return res.status(404).json({ message: 'No medical records found for this patient' });
    }

    res.status(200).json(medicalRecords);
  } catch (error) {
    console.error(`Error retrieving medical records: ${error.message}`);
    res.status(500).json({ message: 'Error retrieving medical records: ' + error.message });
  }
};
