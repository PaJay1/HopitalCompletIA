// controllers/appointment.js
//const axios = require('axios');
const Departement = require('../models/deptmodel');

exports.ajouterDept = async (req, res) => {
    const { nom, description } = req.body;
  
    if (!nom || !description) {
      return res.status(400).send({ message: 'Rempli tout' });
    }
  
    try {
      const newADepartement = new Departement({ nom, description });
      await newADepartement.save();
      res.status(201).send(newADepartement);
    } catch (error) {
      res.status(500).send({ message: 'Error creating appointment: ' + error.message });
    }
  };

// Obtenir les départements pour remplir le menu déroulant
exports.getDepartements = async (req, res) => {
  try {
    const departements = await Departement.find();
    res.status(200).json(departements);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDepartements = async (req, res) => {
  try {
    const departement = await Departement.findByIdAndDelete(req.params.id);
    
    if (!departement) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



// Mettre à jour un département existant
exports.updateDepartement = async (req, res) => {
  const { nom, description } = req.body;
  
  try {
    const departement = await Departement.findByIdAndUpdate(
      req.params.id,
      { nom, description },
      { new: true, runValidators: true } // `new: true` renvoie l'objet mis à jour, `runValidators: true` applique les validations
    );
    
    if (!departement) {
      return res.status(404).json({ success: false, message: 'Département non trouvé' });
    }
    
    res.status(200).json(departement);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
