import type { Response } from 'express'

export type SuccessResult<T> = {
  data: T
  status: 'success'
}

export const buildSuccessResult = <T>(data: T): SuccessResult<T> => ({
  data,
  status: 'success'
})

export const postSuccessResponse = <T>(res: Response, data: T, statusCode: number): void => {
  res.status(statusCode).json(buildSuccessResult(data))
}

export const okSuccessResponse = <T>(res: Response, data: T, statusCode: number): void => {
  res.status(statusCode).json(buildSuccessResult(data))
}

export const putSuccessResponse = <T>(res: Response, data: T, statusCode: number): void => {
  res.status(statusCode).json(buildSuccessResult(data))
}
