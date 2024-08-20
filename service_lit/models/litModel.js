const mongoose = require('mongoose');

const litSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, required: false },
  num: { type: String, required: true },
  status: { type: String, enum: ['occupe', 'disponible'], required: true } 
});

module.exports = mongoose.model('lit', litSchema);
