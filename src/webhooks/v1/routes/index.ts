import {FastifyInstance, FastifyPluginOptions, FastifyRequest} from 'fastify';
import {TokenValidator} from '../../../core/middleware/token-validator';
import {CreateWebhookHandler} from '../handlers/create-webhook-hander';
import {DeleteWebhookHandler} from '../handlers/delete-webhook-hander';


export default (fastify: FastifyInstance, _opts: FastifyPluginOptions, done: (err?: Error) => void) => {
  fastify.addHook('onRequest', (request, reply, done) => new TokenValidator().validate(request, reply, done));
  fastify.route({
    method: 'POST',
    url: '/webhooks',
    handler: async (
      request: FastifyRequest & {user_id: number},
      reply
    ) => new CreateWebhookHandler().handle(request, reply)
  });
  fastify.route({
    method: 'DELETE',
    url: '/webhooks/:id',
    handler: async (
      request: FastifyRequest<{ Params: {id: number} }> & {user_id: number},
      reply
    ) => new DeleteWebhookHandler().handle(request, reply)
  });
  done();
};