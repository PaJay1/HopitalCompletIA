// controllers/appointment.js
const axios = require('axios');
const Appointment = require('../models/rdvModel');

// Fonction pour obtenir les détails de l'utilisateur depuis le microservice gestion_user via l'API Gateway
const getUserDetails = async (userId, token) => {
  try {
    console.log(`Fetching user details for ID: ${userId}`);
    const response = await axios.get(`http://localhost:5000/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utilisation du token JWT
      }
    });
    console.log(`User details fetched successfully: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user details: ${error.message}`);
    throw new Error('Error fetching user details: ' + error.message);
  }
};

exports.createAppointment = async (req, res) => {
  const { patientId, doctorId, date } = req.body;

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  const token = req.headers.authorization.split(' ')[1]; // Récupérer le token du header

  if (!patientId || !doctorId || !date) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    const patient = await getUserDetails(patientId, token);
    const doctor = await getUserDetails(doctorId, token);

    if (!patient || !doctor) {
      return res.status(404).send({ message: 'Patient or Doctor not found' });
    }

    // Créer le rendez-vous avec un statut par défaut de 'pending'
    const newAppointment = new Appointment({ patientId, doctorId, date, status: 'pending' });
    await newAppointment.save();
    res.status(201).send(newAppointment);
  } catch (error) {
    res.status(500).send({ message: 'Error creating appointment: ' + error.message });
  }
};


// Fonction pour obtenir tous les rendez-vous
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching appointments: ' + error.message });
  }
};

// Fonction pour obtenir un rendez-vous par ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }

    // Ajouter les détails du patient et du docteur via l'API
    const token = req.headers.authorization.split(' ')[1]; // Récupérer le token du header
    appointment.patientId = await getUserDetails(appointment.patientId, token);
    appointment.doctorId = await getUserDetails(appointment.doctorId, token);

    res.status(200).send(appointment);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching appointment: ' + error.message });
  }
};

// Fonction pour mettre à jour un rendez-vous
exports.updateAppointment = async (req, res) => {
  const { patientId, doctorId, date, status } = req.body;

  if (!patientId || !doctorId || !date || !status) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    // Mise à jour du rendez-vous
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { patientId, doctorId, date, status }, { new: true });
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }
    res.status(200).send(appointment);
  } catch (error) {
    res.status(500).send({ message: 'Error updating appointment: ' + error.message });
  }
};

// Fonction pour supprimer un rendez-vous
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: 'Error deleting appointment: ' + error.message });
  }
};



// Récupérer les rendez-vous par patientId
exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
};

exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
};



exports.updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !['approved', 'cancelled'].includes(status)) {
    return res.status(400).send({ message: 'Invalid status' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).send({ message: 'Appointment not found' });
    }
    res.status(200).send(appointment);
  } catch (error) {
    res.status(500).send({ message: 'Error updating appointment: ' + error.message });
  }
};








