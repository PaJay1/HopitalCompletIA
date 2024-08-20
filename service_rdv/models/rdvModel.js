const mongoose = require('mongoose');

const rdvSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], required: true } // Ajout de 'pending' pour l'attente
});

module.exports = mongoose.model('rdv', rdvSchema);
