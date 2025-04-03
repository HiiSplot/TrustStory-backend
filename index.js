// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Créer un pool de connexions MySQL
const pool = require('./config/db');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());
app.use(cors());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  
  try {
    
    const query = 'SELECT * FROM users WHERE pseudo = ? OR email = ?';
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

      
      const token = jwt.sign({ id: userInDb.id, username: userInDb.user, password: userInDb.password }, SECRET_KEY, { expiresIn: '1h' });

      // Si le mot de passe est correct, tu peux envoyer une réponse indiquant que la connexion est réussie
      res.json({ token, userId: userInDb.id });
    });
  } catch (error) {
    res.status(500).json({ message: 'Une erreur est survenue lors de la tentative de connexion.' });
  }
});

// Route d'inscription
app.post('/signup', async (req, res) => {
  const { firstName, lastName, pseudo, password, email, date } = req.body;
  const createdAt = new Date();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (firstname, lastname, pseudo, password, email, createdAt, birthday) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, pseudo, hashedPassword, email, createdAt, date];

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

// Récupération données profil
app.get('/profil/:userId', async (req, res) => {
  try {
    const query = `SELECT id, firstname, lastname, pseudo, email, birthday FROM users WHERE id = ?`;
    const id = req.params.userId;
    console.log(id);
    

    pool.query(query, [id], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des données :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupération des favoris
app.get('/profil/:userId/favorite', async (req, res) => {
  try {
    const query = `SELECT stories.id, title, date, author, description FROM stories INNER JOIN favorites_stories ON stories.id = favorites_stories.id_story WHERE favorites_stories.id_user = ?`;
    const userId = req.params.userId;

    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupération des histoires by user
app.get('/profil/:userId/stories', async (req, res) => {
  try {
    const query = `SELECT * FROM stories WHERE user_id = ?`;
    const userId = req.params.userId;

    pool.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des histoires :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
})

// Récupération des catégories
app.get('/categories', async (req, res) => {
  try {
    const query = 'SELECT * FROM categories';
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la sélection des catégories :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.' });
      }
      
      res.json(results);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des catégories.' });
  }
});

// Récupération des histoires
app.get('/stories', async (req, res) => {
  try {
    const query = 'SELECT * FROM stories';
    pool.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la sélection des histoires :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des histoires :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des histoires.' });
  }
});

// Création d'une histoire
app.post('/stories', async (req, res) => {
  const { title, date, author, description, categoryId, userId } = req.body;
  try {
    const query = `INSERT INTO stories (title, date, author, description, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [title, date, author, description, categoryId, userId];

    pool.query(query, values, (err, results) => {
      if (err) {
        console.error("Erreur lors de l'insertion de l'histoire :", err);
        return res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'histoire.' });
      }

      res.status(201).json({ message: 'Histoire créée avec succès !' });
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'histoire :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'histoire.' });
  }
})

// Récupération des histoires likées par l'utilisateur
app.get('/stories/:userId', async (req, res) => {
  const query = `SELECT * FROM favorites_stories WHERE id_story = ?`;
  const userId = req.params.userId;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.json(results);
  });
});

// Suppression d'une histoire
app.delete('/stories/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    const query = `DELETE FROM stories WHERE id = ?`;

    pool.query(query, [storyId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupération des histoires likées par l'utilisateur
app.get('/stories/:storyId/:userId', async (req, res) => {
  const query = `SELECT * FROM favorites_stories WHERE id_story = ? AND id_user = ?`;
  const { storyId, userId } = req.params;

  pool.query(query, [storyId, userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des favoris :", err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    res.json(results);
  });
});

// Ajout d'une histoire en favoris
app.post('/stories/:storyId/:userId', async (req, res) => {
  try {
    const { storyId, userId } = req.params;
    
    const query = `INSERT INTO favorites_stories (id_story, id_user) VALUES (?, ?)`;

    pool.query(query, [storyId, userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Suppression d'une histoire en favoris
app.delete('/stories/:storyId/:userId', async (req, res) => {
  try {
    const { storyId, userId } = req.params;
    
    const query = `DELETE FROM favorites_stories WHERE id_story = ? AND id_user = ?`;

    pool.query(query, [storyId, userId], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des favoris :", err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Accès refusé, token manquant' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user; // Ajoute les infos de l'utilisateur à la requête
    next();
  });
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Bienvenue sur une route protégée !', user: req.user });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
