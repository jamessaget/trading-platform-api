import {FastifyInstance, FastifyPluginOptions, FastifyRequest} from 'fastify';
import {CreateUserHandler} from '../handlers/create-user-hander';

export default (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: ((err?: Error) => void)) => {
  fastify.route({
    method: 'POST',
    url: '/users',
    handler: async (
      request: FastifyRequest & {user_id: number},
      reply
    ) => new CreateUserHandler().handle(request, reply)
  });
  done();
};