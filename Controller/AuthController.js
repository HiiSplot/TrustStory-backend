const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

const AuthController = {
  async signup(req, res) {
    const { user, password, email, date } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.createUser(user, hashedPassword, email, date);
      res.status(201).json({ message: 'Utilisateur créé avec succès !', userId });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  },

  async login(req, res) {
    const { user, password } = req.body;

    try {
      const userInDb = await UserModel.login(user);
      if (!userInDb) {
        return res.status(404).json({ message: 'Identifiants incorrects.' });
      }

      const isPasswordValid = await bcrypt.compare(password, userInDb.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const token = jwt.sign(
        { id: userInDb.id, username: userInDb.name, email: userInDb.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.json({ token });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  }
};

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

module.exports = AuthController;
