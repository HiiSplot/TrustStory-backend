import { Request, Response, Router } from 'express'
import { createUser, loginUser } from '../Service/userService';
import { okSuccessResponse } from '../Responses/success';
import { sendUnknownErrorResponse } from '../Responses/error';

export type UserSignIn = {
  lastName: string
  firstName: string
  pseudo: string
  password: string
  email: string
  date: Date
}

export const UserController = Router();

UserController.post('/login', async (req: Request, res: Response) => {
  const { user, password } = req.body;

  const result = await loginUser(user, password, res)
  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

// Route d'inscription
UserController.post('/signup', async (req: Request, res: Response) => {
  const { firstName, lastName, pseudo, password, email, date } = req.body
  const createdAt = new Date();
  const userData: UserSignIn = {
    firstName: firstName,
    lastName: lastName,
    pseudo: pseudo,
    password: password,
    email: email,
    date: date
  }

  const result = await createUser(userData, createdAt, res)
  if (result.status === 'success') {
    okSuccessResponse(res, result.data, 201)
  } else {
    sendUnknownErrorResponse(res, result.error)
  }
});

