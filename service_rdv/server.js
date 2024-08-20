// app.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/error');
// Load env variables
dotenv.config({ path: '../config/config.env' }); 

dotenv.config({ path: './config/config.env' });

const app = express();
const port = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Error handling middleware
app.use(errorMiddleware);

// MongoDB connection
const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB : ${con.connection.host}`);
  } catch (error) {
    console.log(`MongoDB error : ${error}`);
  }
}

// Routes
const rdvRoutes = require('./routes/rdvRoutes');
app.use('/rdv', rdvRoutes);

connectDb();

app.listen(port, () => {
  console.log(`Appointment service running on port ${port}`);
});








