const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Departement = require('../models/userModel');


// Ajouter un utilisateur
exports.ajouterUser = async (req, res) => {
  try {
    const { nom, prenom, email, num, nas, sexe, mdp, role, specialisation, departement } = req.body;
    
    // Check if specialization and department are provided for Doctor role
    if (role === 'Doctor' && (!specialisation || !departement)) {
      return res.status(400).json({ success: false, message: 'La spécialisation et le département sont obligatoires pour le médecin' });
    }
    
    const user = await User.create({ nom, prenom, email, num, nas, sexe, mdp, role, specialisation, departement });
    const token = user.generateJsonWebToken();
    
    res.status(201).json({ success: true, token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  const { nom, prenom, email, num, nas, sexe, mdp, role, specialisation, departement } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur n\'existe pas' });
    }
    
    // modification
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (num) user.num = num;
    if (nas) user.nas = nas;
    if (sexe) user.sexe = sexe;
    if (mdp) user.mdp = mdp; // This will trigger the pre-save hook to hash the password
    if (role) user.role = role;
    if (role === 'Doctor' && specialisation) user.specialisation = specialisation; // Only update specialization if role is Doctor
    if (role === 'Doctor' && departement) user.departement = departement; // Only update department if role is Doctor
    
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};






// Connexion des utilisateur
exports.connUser = async (req, res) => {
  const { email, mdp } = req.body;
  
  if (!email || !mdp) {
    return res.status(400).json({ success: false, message: 'Mot de passe et Email obligatoire' });
  }
  
  try {
    const user = await User.findOne({ email }).select('+mdp');
    
    if (!user || !(await user.comparePassword(mdp))) {
      return res.status(401).json({ success: false, message: 'Information non valide' });
    }
    
    const token = user.generateJsonWebToken();
    res.status(200).json({ success: true, token, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Afficher un utilisateur
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'Patient' }).select('_id nom prenom email role nas num');
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des patients: ' + error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('_id nom prenom email role specialisation departement nas num');
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des médecins: ' + error.message });
  }
};






/* Modifier un utilisateur
exports.updateUser = async (req, res) => {
  const { nom, prenom, email, num, nas, sexe, mdp, role, specialisation, departement } = req.body;
  
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    // modification
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (num) user.num = num;
    if (nas) user.nas = nas;
    if (sexe) user.sexe = sexe;
    if (mdp) user.mdp = mdp; // This will trigger the pre-save hook to hash the password
    if (role) user.role = role;
    if (role === 'Doctor' && specialisation) user.specialisation = specialisation; // Only update specialization if role is Doctor
    if (role === 'Doctor' && departement) user.departement = departement; // Only update department if role is Doctor
    
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};*/

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
