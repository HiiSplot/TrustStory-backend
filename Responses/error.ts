import type { Response } from 'express'
// import type { ZodIssue } from 'zod'

export type CommonError = {
  code: 'db_error'
  error: Error
} | ValidationError

export type HTTPError = {
  code: 'not_found' | 'conflict' | 'bad_request' | 'internal_server_error' | 'user_unauthorized'
}
export type CustomError = {
  code: string
}

export type ValidationError = {
  code: 'validation_error'
  // errors: ZodIssue[]
}

// export type DomainError<E extends CustomError | CommonError | HTTPError | ValidationError> = ZodIssue | E

// export type ErrorResponse<E extends CustomError | CommonError | HTTPError | ValidationError> = {
//   error: DomainError<E>
//   status: 'error'
// }
export type ErrorResult<E extends CustomError | CommonError | ValidationError> = {
  error: E
  status: 'error'
}

export const buildErrorResult = <E extends CustomError | CommonError | ValidationError | HTTPError>(error: E): ErrorResult<E> => {
  return {
    error,
    status: 'error'
  }
}

export const buildInternalErrorResponse = (error: Error) => buildErrorResult({ code: 'internal_server_error', error })

export const sendBadRequestResponse = <E extends CustomError | CommonError | ValidationError>(res: Response, error: E) => {
  res.status(400).json(buildErrorResult(error))
}

export const sendConflictResponse = <E extends CustomError | CommonError>(res: Response, error: E) => {
  res.status(409).json(buildErrorResult(error))
}

export const sendMissingPreconditionResponse = <E extends CustomError | CommonError>(res: Response, error: E) => {
  res.status(428).json(buildErrorResult(error))
}

export const sendUnprocessableEntityResponse = <E extends CustomError | CommonError | ValidationError>(res: Response, error: E) => {
  res.status(422).json(buildErrorResult(error))
}

export const sendUnAuthorizedResponse = <E extends CustomError | CommonError>(res: Response, error: E) => {
  res.status(401).json(buildErrorResult(error))
}

export const sendUnknownErrorResponse = (res: Response, error: unknown) => {
  res.status(500).send(error)
}

export const sendImportErrorResponse = <E extends CustomError | CommonError>(res: Response, error: E) => {
  res.status(500).json(buildErrorResult(error))
}

export const sendNotFoundResponse = <E extends CustomError | CommonError>(res: Response, error: E) => {
  res.status(404).json(buildErrorResult(error))
}
