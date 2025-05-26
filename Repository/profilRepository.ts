import { pool } from "../config/db";
import { ResponsePromise } from "./userRepository";

export const getAllDataUserDB = async (userId: string): ResponsePromise => {
  try {
    const query = `SELECT id, firstname, lastname, pseudo, email, birthday FROM users WHERE id = ?`
    const [result] = await pool.query(query, userId)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}

export const getAllFavoritesDB = async (userId: string): ResponsePromise => {
  try {
    const query = `SELECT * FROM stories INNER JOIN favorites_stories ON stories.id = favorites_stories.id_story WHERE favorites_stories.id_user = ?`
    const [result] = await pool.query(query, userId)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}

export const getAllUserStoriesDB = async (userId: string): ResponsePromise => {
  try {
    const query = `SELECT * FROM stories WHERE user_id = ?`
    const [result] = await pool.query(query, userId)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}