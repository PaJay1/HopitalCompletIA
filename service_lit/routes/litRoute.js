// routes/appointments.js
const express = require('express');
const router = express.Router();
const lit = require('../controllers/lit');


// Créer un nouveau rendez-vous
router.post('/', lit.ajouterLit);
router.get('/lits', lit.getLits);
router.delete('/:id', lit.deleteLits);
router.put('/:id', lit.updateLit);
router.put('/:id', lit.updateLit1);


module.exports = router;