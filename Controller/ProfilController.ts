import { Request, Response, Router } from "express"
import { getAllDataUser, getAllFavorites, getAllUserStories } from "../Service/profilService";
import { okSuccessResponse } from "../Responses/success";
import { sendUnknownErrorResponse } from "../Responses/error";

export const ProfilController = Router();

// Récupération données profil
ProfilController.get('/profil/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await getAllDataUser(userId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Récupération des favoris
ProfilController.get('/profil/:userId/favorite', async (req: Request, res: Response) => {

  const userId = req.params.userId;
  const result = await getAllFavorites(userId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Récupération des histoires by user
ProfilController.get('/profil/:userId/stories', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await getAllUserStories(userId)

  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
})