import {ZodError} from 'zod';
import {ApplicationClientError} from './application-client-error';

export const globalErrorHandler = (error, request, reply) => {
  console.log({error, request});
  if (error instanceof ZodError) {
    return reply.status(422).send({
      message: 'Valdiation Error',
      errors: error.errors
    });
  }
  if (error instanceof ApplicationClientError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }
  reply.status(500).send({message: 'Server Error'});
};