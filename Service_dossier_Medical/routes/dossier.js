// routes/appointments.js
const express = require('express');
const router = express.Router();
const dossier = require('../controller/dossier');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// Créer un nouveau rendez-vous
router.post('/', protect, dossier.ajouterDossier);
router.get('/dossierPatient/:patientId', dossier.getMedicalRecordsByPatient);

module.exports = router;