import { DataStoryArray } from "../Controller/StoryController"
import { addStoryInFavDB, createStoryDB, deleteStoryDB, deleteStoryFromFavDB, getAllCategoriesDB, getAllStoriesDB, getCategoryByIdDB, getFavoriteByUserDB, getStoryByIdDB } from "../Repository/storyRepository"
import { ResponsePromise } from "../Repository/userRepository"

export const getAllCategories = async (): ResponsePromise => {
  return await getAllCategoriesDB()
}

export const getCategoryById = async (categoryId: string) => {
  return await getCategoryByIdDB(categoryId)
}

export const getAllStories = async (
  filters?: number[],
  searchValue?: string
): ResponsePromise => {
  return await getAllStoriesDB(filters, searchValue)
}

export const getStoryById = async (storyId: string): ResponsePromise => {
  return await getStoryByIdDB(storyId)
}

export const createStory = async (storyData: DataStoryArray): ResponsePromise => {
  return await createStoryDB(storyData)
}

export const deleteStory = async (storyId: string): ResponsePromise => {
  return await deleteStoryDB(storyId)
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