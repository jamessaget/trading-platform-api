import {generalConfig} from '../../config/general';
import jwt, {JsonWebTokenError} from 'jsonwebtoken';
import {FastifyReply, FastifyRequest} from 'fastify';

export class TokenValidator {
  public validate(
    request: FastifyRequest,
    reply: FastifyReply,
    done: ((err?: Error) => void)
  ) {
    try {
      if (!request.headers.authorization) {
        return reply.code(422).send({
          message: 'Authorization header is required'
        });
      }
      const token = jwt.verify(request.headers.authorization.substring(7).trim(), generalConfig.privateAuthKey);
      if (
        (typeof token === 'string') ||
                typeof token === 'object' && !token?.data?.user_id
      ) {
        throw new JsonWebTokenError('Malformed token');
      }
      (request as FastifyRequest & {user_id?: number}).user_id = token.data.user_id;
      done();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        console.log(error);
        return reply.code(401).send({message: 'Invalid token'});                
      }
      throw error;
    }
  }
}