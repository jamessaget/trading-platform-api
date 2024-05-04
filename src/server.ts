import Fastify from 'fastify';
import {generalConfig} from './config/general';
import {globalErrorHandler} from './core/errors/global-error-handler';

const fastify = Fastify({
  logger: true
});
fastify.setErrorHandler(globalErrorHandler);

fastify.register(require('./deals/v1/routes/index'), {prefix: '/v1'});
fastify.register(require('./users/v1/routes/index'), {prefix: '/v1'});
fastify.register(require('./webhooks/v1/routes/index'), {prefix: '/v1'});
fastify.register(require('./oauth/v1/routes/index'), {prefix: '/v1'});

fastify.ready(() => {
  console.log(fastify.printRoutes());
});

fastify.listen({port: generalConfig.httpPort, host: '::'}, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

export default fastify;