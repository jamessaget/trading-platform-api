import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {generalConfig} from '../../../config/general';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {ApplicationClientError} from '../../../core/errors/application-client-error';
import {oauthTokenHttpSchema} from '../../../core/schema/oauth-token-http-schema';
import {FastifyRequest, FastifyReply} from 'fastify';

export class CreateOAuthTokenHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = oauthTokenHttpSchema.parse(request.body);
    const user = await this.prismaClient.users.findFirst({
      where: {
        email: data.username
      }
    });
    await new Promise((resolve, reject) => {
      bcrypt.compare(data.password, user.password, (error, result) => {
        if (error) {
          return reject(error);
        };
        if (result) {
          return resolve(result);
        }
        reject(new ApplicationClientError('Unable to authenticate', 401));
      });
    });
    return reply.code(200).send({
      data: {
        token: jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60),
          data: {user_id: user.id}
        }, generalConfig.privateAuthKey)
      }
    });
  }
}