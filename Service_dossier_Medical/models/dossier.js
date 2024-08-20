const mongoose = require('mongoose');

const dossierchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  antecedant: {
    type: String,
    required: [true, "L antecedant est obligatoire!"],},
  diagnostic: {
    type: String,
    required: [true, "Le diagnostic est obligatoire!"],},
  traitement: {
    type: String,
    required: [true, "Le traitement est obligatoire!"],},
});

module.exports = mongoose.model('dossier', dossierchema);



