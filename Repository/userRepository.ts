import { Response } from "express";
import bcrypt from "bcrypt"
import { pool } from "../config/db";

export const createdUser = async (
  firstName: string,
  lastName: string,
  pseudo: string,
  password: string,
  email: string,
  createdAt: Date,
  date: string,
  res: Response
): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (firstname, lastname, pseudo, password, email, createdAt, birthday) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, pseudo, hashedPassword, email, createdAt, date];

    await pool.query(query, values);

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
  }
};