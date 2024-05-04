import {CreateDealsValidator} from '../../../core/validation/create-deals-validator';
import {TokenValidator} from '../../../core/middleware/token-validator';
import {UpdateDealsValidator} from '../../../core/validation/update-deals-validator';
import {GetDealsHandler} from '../handlers/get-deals-hander';
import {CreateDealsHandler} from '../handlers/create-deals-hander';
import {UpdateDealsHandler} from '../handlers/update-deals-hander';
import {FastifyInstance, FastifyPluginOptions, FastifyRequest} from 'fastify';


export default (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: ((err?: Error) => void)) => {
  fastify.addHook('onRequest', (request, reply, done) => new TokenValidator().validate(request, reply, done));
  fastify.route({
    method: 'GET',
    url: '/deals',
    handler: async (
      request: FastifyRequest & {user_id: number},
      reply
    ) => new GetDealsHandler().handle(request, reply)
  });
  fastify.route({
    method: 'POST',
    url: '/deals',
    preValidation: async (
      request: FastifyRequest & {user_id: number},
      reply
    ) => new CreateDealsValidator().validate(request, reply),
    handler: async (
      request: FastifyRequest & {user_id: number},
      reply
    ) => new CreateDealsHandler().handle(request, reply)
  });
  fastify.route({
    method: 'PATCH',
    url: '/deals/:id',
    preValidation: (
      request: FastifyRequest<{ Params: {id: number} }> & {user_id: number},
      reply
    ) => new UpdateDealsValidator().validate(request, reply),
    handler: async (
      request: FastifyRequest<{ Params: {id: number} }> & {user_id: number},
      reply
    ) => new UpdateDealsHandler().handle(request, reply)
  });
  done();
};