import { Request, Response, Router } from 'express'
import { okSuccessResponse } from "../Responses/success";
import { sendUnknownErrorResponse } from "../Responses/error";
import { addStoryInFav, deleteStoryFromFav, getFavoriteByStory, getFavoriteByUser } from '../Service/favoriteService';

export const FavoriteController = Router();

// Récupération des likes d'une story
FavoriteController.get('/favorites/:storyId', async (req: Request, res: Response) => {
  const { storyId } = req.params;
  const result = await getFavoriteByStory(storyId)
  
  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Récupération de l'histoire likée par l'utilisateur
FavoriteController.get('/favorites/:storyId/:userId', async (req: Request, res: Response) => {
  const { storyId, userId } = req.params;
  const values = [storyId, userId]
  const result = await getFavoriteByUser(values)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Ajout d'une histoire en favoris
FavoriteController.post('/favorites/:storyId/:userId', async (req: Request, res: Response) => {
    const { storyId, userId } = req.params;
    const values = [storyId, userId]
    const result = await addStoryInFav(values)

    if (result.status === 'success') {
      okSuccessResponse(res, result.data, 201)
    } else {
      sendUnknownErrorResponse(res, result.error)
    }
});

// Suppression favori d'une histoire
FavoriteController.delete('/favorites/:storyId/:userId', async (req: Request, res: Response) => {
  const { storyId, userId } = req.params;
  const values = [storyId, userId]
  const result = await deleteStoryFromFav(values)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});