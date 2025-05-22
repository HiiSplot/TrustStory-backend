import { getAllDataUserDB, getAllFavoritesDB, getAllUserStoriesDB } from "../Repository/profilRepository";
import { ResponsePromise } from "../Repository/userRepository";

export const getAllDataUser = async (userId: string): ResponsePromise => {
  return await getAllDataUserDB(userId)
}

export const getAllFavorites = async (userId: string): ResponsePromise => {
  return await getAllFavoritesDB(userId)
}

export const getAllUserStories = async (userId: string): ResponsePromise => {
  return await getAllUserStoriesDB(userId)
}