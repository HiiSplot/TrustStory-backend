import { Request, Response, Router } from 'express'
import { okSuccessResponse } from '../Responses/success';
import { sendUnknownErrorResponse } from '../Responses/error';
import { createStory, deleteStory, getAllCategories, getAllStories, getCategoryById, getStoryById } from '../Service/storyService';

export const StoryController = Router();

export type DataStoryType = {
  title: string;
  date: Date;
  author: string;
  description?: string;
  categoryId: number;
  userId: number;
}

export type DataStoryArray = DataStoryType[]

// Récupération des catégories
StoryController.get('/categories', async (req: Request, res: Response) => {
  const result = await getAllCategories()

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

StoryController.get('/categories/:categoryId', async (req: Request, res: Response) => {
  const { categoryId } = req.params
  const result = await getCategoryById(categoryId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
})

// Récupération des histoires
StoryController.get('/stories', async (req: Request, res: Response) => {
  const { filters, value } = req.query;

  let parsedFilters: number[] = [];
  
  if (filters) {
    const filtersArray = Array.isArray(filters) ? filters : [filters];
    parsedFilters = filtersArray.map(f => parseInt(f, 10)).filter(f => !isNaN(f));
  }
  
  const result = await getAllStories(parsedFilters, value as string);

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Récupération d'une histoire
StoryController.get('/stories/:storyId', async (req: Request, res: Response) => {
  const { storyId } =  req.params
  const result = await getStoryById(storyId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Création d'une histoire
StoryController.post('/stories', async (req: Request, res: Response) => {
  const { title, date, author, description, categoryId, userId } = req.body;
  const values = [title, date, author, description, categoryId, userId]
  const result = await createStory(values) 

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
})

// Suppression d'une histoire
StoryController.delete('/stories/:storyId', async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const result = await deleteStory(storyId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});
