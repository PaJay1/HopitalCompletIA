// controllers/appointment.js
//const axios = require('axios');
const Lit = require('../models/litModel');

exports.ajouterLit = async (req, res) => {
    const { num, status } = req.body;
  
    if (!num || !status) {
      return res.status(400).send({ message: 'Rempli tout' });
    }
  
    try {
      const newALit = new Lit({ num, status });
      await newALit.save();
      res.status(201).send(newALit);
    } catch (error) {
      res.status(500).send({ message: 'Error creating lit: ' + error.message });
    }
  };

// Obtenir les départements pour remplir le menu déroulant
exports.getLits = async (req, res) => {
  try {
    const lits = await Lit.find();
    res.status(200).json(lits);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteLits = async (req, res) => {
  try {
    const lit = await Lit.findByIdAndDelete(req.params.id);
    
    if (!lit) {
      return res.status(404).json({ success: false, message: 'Utilisateur existe pas' });
    }
    
    res.status(204).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



// Mettre à jour un département existant
exports.updateLit = async (req, res) => {
  const { num, status } = req.body;
  
  try {
    const lit = await Lit.findByIdAndUpdate(
      req.params.id,
      { num, status },
      { new: true, runValidators: true } // `new: true` renvoie l'objet mis à jour, `runValidators: true` applique les validations
    );
    
    if (!lit) {
      return res.status(404).json({ success: false, message: 'Lit non trouvé' });
    }
    
    res.status(200).json(lit);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


exports.updateLit1 = async (req, res) => {
  const { num, status, patientId } = req.body;

  try {
      const updatedData = { num, status };
      if (status === 'occupe' && patientId) {
          updatedData.patientId = patientId;
      } else if (status === 'disponible') {
          updatedData.patientId = null; // Désassigner le lit
      }

      const lit = await Lit.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true, runValidators: true }
      );

      if (!lit) {
          return res.status(404).json({ success: false, message: 'Lit non trouvé' });
      }

      res.status(200).json(lit);
  } catch (error) {
      res.status(400).json({ success: false, error: error.message });
  }
};
