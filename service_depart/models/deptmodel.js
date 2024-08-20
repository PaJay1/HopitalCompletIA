const mongoose = require('mongoose');

const departement = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire!"],},

  description: {
    type: String,
    required: [true, "La description est obligatoire!"],},
  
});

module.exports = mongoose.model('departement', departement);