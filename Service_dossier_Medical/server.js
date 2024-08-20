// app.js
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const errorMiddleware = require('./middlewares/error');


dotenv.config({ path: './config/.env' });

const app = express();
const port = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Error handling middleware
//app.use(errorMiddleware);

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
const DossierRoutes = require('./routes/dossier');
app.use('/dossier', DossierRoutes);

connectDb();

app.listen(port, () => {
  console.log(`DOSSIER service running on port ${port}`);
});

