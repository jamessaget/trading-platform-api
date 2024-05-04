import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {FastifyRequest, FastifyReply} from 'fastify';

export class DeleteWebhookHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest<{ Params: {id: number} }> & {user_id: number},
    reply: FastifyReply
  ): Promise<FastifyReply> {
    await this.prismaClient.webhooks.delete({
      where: {
        id: +request.params.id,
        user_id: request.user_id
      }
    });
    return reply.code(200).send();
  }
}