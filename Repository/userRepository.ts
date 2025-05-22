import { Response } from "express";
import bcrypt from "bcrypt"
import { pool } from "../config/db";
import jwt from "jsonwebtoken"
import { UserSignIn } from "../Controller/UserController";

export type ResponsePromise = Promise<{ status: 'success'; data: any } | { status: 'error'; error: any }>

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const createUserDB = async (
  userData: UserSignIn,
  createdAt: Date,
  res: Response
): ResponsePromise => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const query = `
      INSERT INTO users (firstname, lastname, pseudo, password, email, createdAt, birthday) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { firstName, lastName, pseudo, email, date } = userData;
    const values = [firstName, lastName, pseudo, hashedPassword, email, date, createdAt]

    const [results] = await pool.query(query, values);

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    return { status: 'success', data: results };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    return { status: 'error', error };
  }
};

export const loginUserDB = async (user: string, password: string, res: Response): ResponsePromise => {
  try {    
    const query = 'SELECT * FROM users WHERE pseudo = ? OR email = ?';
    const values = [user, user];

    const [results]: any = await pool.query(query, values);

    const userInDb = results[0];
    const isPasswordValid = await bcrypt.compare(password, userInDb.password);

    if (!userInDb || !isPasswordValid) {
      const error = new Error("Utilisateur non trouvé");
      return { status: "error", error };
    }

    const token = jwt.sign(
      { id: userInDb.id, username: userInDb.pseudo, email: userInDb.email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return {
      status: "success",
      data: { token, userId: userInDb.id }
    }

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    return { status: "error", error };
  }
};
