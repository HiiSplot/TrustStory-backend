// models/UserModel.ts
import { pool } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { UserSignIn } from "../Controller/UserController";

interface User extends RowDataPacket {
  id: number;
  firstName: string;
  lastName: string;
  pseudo: string;
  email: string;
  password: string;
}

export const UserModel = {
  async findByNameOrEmail(user: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE pseudo = ? OR email = ? LIMIT 1`;
    const [rows] = await pool.query<User[]>(query, [user, user]);

    return rows.length > 0 ? rows[0] : null;
  },

  async createUser(
    userData: UserSignIn) {
    const { firstName, lastName, pseudo, password, email, date } = userData
    const createdAt = new Date();
    const query = `INSERT INTO users (firstName, lastName, pseudo, password, email, createdAt, birthday) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query<ResultSetHeader>(
      query,
      [firstName, lastName, pseudo, password, email, createdAt, date]
    );
    
    return result.insertId;
  }
};

