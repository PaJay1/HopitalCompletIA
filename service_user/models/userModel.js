const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire!"],
    minLength: [3, "Le nom doit avoir au moins 3 caractères!"],
  },
  prenom: {
    type: String,
    required: [true, "Le prénom est obligatoire!"],
    minLength: [3, "Le prénom doit avoir au moins 3 caractères!"],
  },
  num: {
    type: String,
    required: [true, "Le numéro de téléphone est obligatoire!"],
    minLength: [10, "Le numéro doit avoir au moins 10 chiffres!"],
    maxLength: [11, "Le numéro doit avoir max 11 chiffres!"],
  },
  sexe: {
    type: String,
    required: [true, "Le sexe est obligatoire!"],
    enum: ["Male", "Female"],
  },
  nas: {
    type: String,
    required: [true, "NAS is required!"],
    minLength: [13, "NAS doit être composé de 13 chiffres!"],
    maxLength: [13, "NAS doit être composé de 13 chiffres!"],
  },
  email: {
    type: String,
    required: [true, "Email obligatoire!"],
    unique: true,
    validate: [validator.isEmail, "Entrer un email valide!"],
  },
  mdp: {
    type: String,
    required: [true, "Mot de passe obligatoire!"],
    minLength: [8, "Mot de passe doit avoir minimum 8 caractères!"],
    select: false,
  },
  specialisation: {
    type: String,
    required: function() { return this.role === 'Doctor'; },
  },
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departement',
    required: function() { return this.role === 'Doctor'; },
  },
  role: {
    type: String,
    required: [true, "Son rôle est obligatoire!"],
    enum: ["Patient", "Doctor", "Admin", "Infirmier"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("mdp")) {
    return next();
  }
  this.mdp = await bcrypt.hash(this.mdp, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.mdp);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES.trim(), // Assurez-vous de supprimer les espaces
  });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
