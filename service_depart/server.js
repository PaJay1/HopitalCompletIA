const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config({ path: './config/.env' });

const app = express(); // Initialisation de 'app'
const port = process.env.PORT || 5003;

app.use(cors()); // Utilisation de CORS
app.use(express.json()); // Middleware pour parser le corps des requêtes JSON

// Connexion à MongoDB
const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to MongoDB : ${con.connection.host}`);
    } catch (error) {
        console.log(`MongoDB error : ${error}`);
    }
};

connectDb();

// Routes
const DeptRoutes = require('./routes/dept');
app.use('/dept', DeptRoutes);

app.listen(port, () => {
    console.log(`Departement running on port ${port}`);
});
