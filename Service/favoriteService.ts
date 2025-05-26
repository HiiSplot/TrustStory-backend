import { addStoryInFavDB, deleteStoryFromFavDB, getFavoriteByStoryDB, getFavoriteByUserDB } from "../Repository/favoriteRepository"
import { ResponsePromise } from "../Repository/userRepository"

export const getFavoriteByStory = async (storyId: string): ResponsePromise => {
  return await getFavoriteByStoryDB(storyId)
}

export const getFavoriteByUser = async (values: string[]): ResponsePromise => {
  return await getFavoriteByUserDB(values)
}

export const addStoryInFav = async (values: string[]): ResponsePromise => {
  return await addStoryInFavDB(values)
}

export const deleteStoryFromFav = async (values: string[]): ResponsePromise => {
  return await deleteStoryFromFavDB(values)
}