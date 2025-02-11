// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mysql = require('mysql2');
require('dotenv').config();
const bcrypt = require('bcrypt');

// Créer un pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Route d'inscription
app.post('/signup', async (req, res) => {
  const { user, password, email, date } = req.body;
  const createdAt = new Date();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, password, email, createdAt, birthday) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [user, hashedPassword, email, createdAt, date];

    // Utilisation du pool pour exécuter la requête
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
      }

      res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    });
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors du traitement du mot de passe.' });
  }
});

// Route de connexion
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  
  try {
    
    const query = `SELECT * FROM users WHERE name = ? OR email = ?`;
    const values = [user, user];

    // Utilisation du pool pour exécuter la requête
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Erreur lors de la selection de l'utilisateur :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors dela tentative de connexion.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'L\'utilisateur et/ou le mot de passe est incorrect.' });
      }

      const userInDb = results[0];

      // Comparaison du mot de passe haché avec celui fourni
      const isPasswordValid = bcrypt.compare(password, userInDb.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'L\'utilisateur et/ou le mot de passe est incorrect.'  });
      }

      // Si le mot de passe est correct, tu peux envoyer une réponse indiquant que la connexion est réussie
      res.status(200).json({ message: 'Connexion réussie !' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la tentative de connexion.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
