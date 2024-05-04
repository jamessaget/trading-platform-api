import {FastifyInstance, FastifyPluginOptions, FastifyRequest} from 'fastify';
import {CreateOAuthTokenHandler} from '../handlers/create-oauth-token-hander';


export default (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: ((err?: Error) => void)) => {
  fastify.route({
    method: 'POST',
    url: '/oauth/token',
    handler: async (
      request: FastifyRequest,
      reply
    ) => new CreateOAuthTokenHandler().handle(request, reply)
  });
  done();
};