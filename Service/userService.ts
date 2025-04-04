import { Response } from 'express'
import * as userRepository from '../Repository/userRepository'

export const createUser = async (
  firstName: string,
  lastName: string,
  pseudo: string,
  password: string,
  email: string,
  createdAt: Date,
  date: string,
  res: Response
): Promise<void> => {
  return await userRepository.createdUser(firstName, lastName, pseudo, password, email, createdAt, date, res)
}