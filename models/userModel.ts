import { Response } from "express";
import { pool } from "../config/db";

export const UserModel = {
  async login(user: string, password: string) {
    const query = `SELECT * FROM users WHERE name = ? OR email = ?`;
    const [rows] = await pool.query(query, [user, user]);  // Utilisation de await avec pool.query()

    return rows;  // Retourne les lignes (les résultats)
  },

  async createUser(
    firstName: string,
    lastName: string,
    pseudo: string,
    hashedPassword: string,
    email: string,
    date: string) {
    const createdAt = new Date();
    const query = `INSERT INTO users (name, password, email, createdAt, birthday) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [firstName, lastName, pseudo, hashedPassword, email, createdAt, date]);  // Utilisation de await

    return result.insertId;  // Retourne l'ID du nouvel utilisateur
  }
};

module.exports = UserModel;
