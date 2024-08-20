// routes/appointments.js
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/dept');
//const { protect } = require('../middlewares/authMiddleware');
//const isAdmin = require('../middlewares/isAdmin');
console.log("Routes loaded"); // Debugging line
// Créer un nouveau departement
router.post('/',  controllers.ajouterDept);
router.get('/departements', controllers.getDepartements);
router.delete('/:id', controllers.deleteDepartements);
router.put('/:id', controllers.updateDepartement);

module.exports = router;



