import { pool } from "../config/db";
import { ResponsePromise } from "./userRepository";

export const getFavoriteByStoryDB = async (storyId: string): ResponsePromise => {
  try {
    const query = `SELECT * FROM favorites_stories WHERE id_story = ?`
    const [result] = await pool.query(query, storyId)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}

export const getFavoriteByUserDB = async (values: string[]): ResponsePromise => {
  try {
    const query = `SELECT * FROM favorites_stories WHERE id_story = ? AND id_user = ?`;
    const [result] = await pool.query(query, values)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}

export const addStoryInFavDB = async (values: string[]): ResponsePromise => {
  try {
    const query = `INSERT INTO favorites_stories (id_story, id_user) VALUES (?, ?)`;
    const [result] = await pool.query(query, values)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}

export const deleteStoryFromFavDB = async (values: string[]): ResponsePromise => {
  try {
    const query = `DELETE FROM favorites_stories WHERE id_story = ? AND id_user = ?`
    const result = await pool.query(query, values)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}