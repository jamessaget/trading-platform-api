import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {paginatedHttpSchema} from '../../../core/schema/paginated-http-schema';
import {FastifyRequest, FastifyReply} from 'fastify';

export class GetDealsHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest & {user_id: number},
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = paginatedHttpSchema.parse(request.query);
    const deals = await this.prismaClient.user_deals.findMany({
      skip: (data.page - 1) * data.per_page,
      take: data.per_page,
      include: {
        deals: true
      },
      where: {
        user_id: +request.user_id
      }
    });
    return reply.code(200).send({ 
      data: deals.map(deal => deal.deals),
      meta: {
        page: data.page,
        per_page: data.per_page
      }
    });
  }
}