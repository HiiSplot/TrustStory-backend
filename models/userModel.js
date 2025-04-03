const pool = require('../config/db');

const UserModel = {
  async login(user, password) {
    const query = `SELECT * FROM users WHERE name = ? OR email = ?`;
    const [rows] = await pool.query(query, [user, user]);  // Utilisation de await avec pool.query()

    return rows;  // Retourne les lignes (les résultats)
  },

  async createUser(user, hashedPassword, email, date) {
    const createdAt = new Date();
    const query = `INSERT INTO users (name, password, email, createdAt, birthday) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [user, hashedPassword, email, createdAt, date]);  // Utilisation de await

    return result.insertId;  // Retourne l'ID du nouvel utilisateur
  }
};

module.exports = UserModel;
