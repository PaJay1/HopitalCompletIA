const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

router.get('/doctors', userController.getDoctors); // Route publique sans protection
router.get('/patients', userController.getPatients); // Route publique pour obtenir les patients

// Route pour vérifier le token et renvoyer les informations de l'utilisateur
router.get('/verifyToken', protect, userController.verifyToken);


router.post('/ajouter', userController.ajouterUser);
router.post('/login', userController.connUser);
router.get('/:id', protect, userController.getUserById); // Protected route
router.put('/:id', protect, userController.updateUser); // Protected route
router.delete('/:id', protect, isAdmin, userController.deleteUser); // Protected route and only admin

module.exports = router;