import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../database/prisma-database-client-factory';
import {FastifyReply, FastifyRequest} from 'fastify';

export class UpdateDealsValidator {
  private prismaClient: PrismaClient;

  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()) {
    this.prismaClient = prismaClient;
  }

  public async validate(
    request: FastifyRequest<{ Params: {id: number} }> & { user_id: number },
    reply: FastifyReply
  ) {
    const deal = await this.prismaClient.deals.findFirst({
      where: {
        id: +request.params.id
      }
    });
    if (deal.seller_id !== request.user_id) {
      reply.code(401);
      throw new Error('User does not have access to this deal');
    } 
    return;
  }
}