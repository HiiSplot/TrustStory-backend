import { Request, Response, Router } from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/userModel"
import { createUser } from '../Service/userService';
import { okSuccessResponse } from '../Responses/success';
import { sendUnknownErrorResponse } from '../Responses/error';
import { pool } from '../config/db';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const UserController = Router();

const AuthController = {
  async signup(req: Request, res: Response) {
    const { lastName, firstName, pseudo, password, email, date } = req.body;
    
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.createUser(lastName, firstName, pseudo, hashedPassword, email, date);
      res.status(201).json({ message: 'Utilisateur créé avec succès !', userId });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  },

  async login(req: Request, res: Response) {
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

UserController.post('/login', async (req, res) => {
  const { user, password } = req.body;
  
  try {
    
    const query = 'SELECT * FROM users WHERE pseudo = ? OR email = ?';
    const values = [user, user];

    // Utilisation du pool pour exécuter la requête
    pool.query(query, values, (err, results: Array<T>) => {
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
UserController.post('/signup', async (req: Request, res: Response) => {
  const { firstName, lastName, pseudo, password, email, date } = req.body
  const createdAt = new Date();

  const result = await createUser(firstName, lastName, pseudo, password, email, createdAt, date, res)
  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

module.exports = AuthController;
