// routes/appointments.js
const express = require('express');
const router = express.Router();
const rdvController = require('../controllers/rdvController');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');


// Créer un nouveau rendez-vous
router.post('/', protect, rdvController.createAppointment);

// Obtenir tous les rendez-vous
router.get('/', protect, rdvController.getAppointments);

// Obtenir un rendez-vous par ID
router.get('/:id', protect, rdvController.getAppointmentById);

// Mettre à jour un rendez-vous
router.put('/:id', protect, isAdmin, rdvController.updateAppointment);

// Supprimer un rendez-vous
router.delete('/:id', protect, rdvController.deleteAppointment);

// routes/appointments.js
// Obtenir les rendez-vous par patientId
router.get('/patient/:patientId', protect, rdvController.getAppointmentsByPatientId);
// Obtenir les rendez-vous par doctorId
router.get('/doctor/:doctorId', protect, rdvController.getAppointmentsByDoctorId);

// Mettre à jour le statut d'un rendez-vous
router.put('/:id/status', protect, rdvController.updateAppointmentStatus);


module.exports = router;





