import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {DealUpdatedEvent} from '../../../core/events/deal-updated-event';
import {updateDealHttpSchema} from '../../../core/schema/update-deal-http-schema';
import {FastifyRequest, FastifyReply} from 'fastify';

export class UpdateDealsHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest<{ Params: {id: number} }> & {user_id: number},
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = updateDealHttpSchema.parse(request.body);
    const deal = await this.prismaClient.deals.update({
      where: {
        id: +request.params.id
      },
      data: data
    });
    new DealUpdatedEvent().emit(deal);
    return reply.code(200).send({
      data: deal
    });
  }
}