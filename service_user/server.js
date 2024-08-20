require('dotenv').config(); // Charger les variables d'environnement

console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY); 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajout de CORS mod

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); //mod

// MongoDB connection
mongoose.connect('mongodb+srv://dieyeyatma33:allahisone33@clusteryat.0fus6x1.mongodb.net/rHopotal');

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});
