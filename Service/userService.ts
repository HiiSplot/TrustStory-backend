import { Response } from 'express'
import { UserSignIn } from '../Controller/UserController';
import { createUserDB, loginUserDB, ResponsePromise } from '../Repository/userRepository';

export const createUser = async (
  userData: UserSignIn,
  createdAt: Date,
  res: Response
): ResponsePromise => {
  return await createUserDB(userData, createdAt, res)
}

export const loginUser = async (user: string, password: string, res: Response): ResponsePromise => {
  return await loginUserDB(user, password, res)
}