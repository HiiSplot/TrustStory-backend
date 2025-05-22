import { pool } from "../config/db";
import { DataStoryArray } from "../Controller/StoryController";
import { ResponsePromise } from "./userRepository";

export const getAllCategoriesDB = async (): ResponsePromise => {
  try {
    const query = 'SELECT * FROM categories';
    const [result] = await pool.query(query) 
    return { status: 'success', data: result };
  } catch (error) {
    return { status: 'error', error };
  }
}

export const getCategoryByIdDB = async (categoryId: string): ResponsePromise => {
  try {    
    const query = 'SELECT name FROM categories WHERE id = ?';
    const [result] = await pool.query(query, categoryId) 
    return { status: 'success', data: result };
  } catch (error) {
    return { status: 'error', error };
  }
}

export const getAllStoriesDB = async (
  filters?: number[],
  searchValue?: string
): ResponsePromise => {
  try {
    let query = 'SELECT * FROM stories'
    const values: any[] = []
    const conditions: string[] = []

    if (filters && filters.length > 0) {
      filters.forEach((value) => {
        conditions.push(`category_id = ?`)
        values.push(value)
      })
    }

    if (searchValue) {
      conditions.push(`(title LIKE ? OR description LIKE ?)`)
      values.push(`%${searchValue}%`, `%${searchValue}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' OR ')
    }    

    const [result] = await pool.query(query, values)
    return { status: 'success', data: result }
  } catch (error) {
    return { status: 'error', error }
  }
}


export const getStoryByIdDB = async (storyId: string): ResponsePromise => {
  try {
    const query = 'SELECT * FROM stories WHERE id = ?'
    const [result] = await pool.query(query, storyId)
    return { status: 'success', data: result[0]}
  } catch (error) {
    return { status: 'error', error }
  }
}

export const createStoryDB = async (storyData: DataStoryArray): ResponsePromise => {
  try {
    const query = `
      INSERT INTO stories (title, date, author, description, category_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, storyData);
    
    return { status: 'success', data: result };
  } catch (error) {
    return { status: 'error', error };
  }
};

export const deleteStoryDB = async (storyId: string): ResponsePromise => {
  try {
    const query = `DELETE FROM stories WHERE id = ?`
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