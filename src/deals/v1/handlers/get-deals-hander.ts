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
    const subscribedSellers = (await this.prismaClient.user_sellers.findMany({
      skip: (data.page - 1) * data.per_page,
      take: data.per_page,
      where: {
        user_id: +request.user_id
      }
    })).map((seller) => seller.seller_id);
    const deals = await this.prismaClient.deals.findMany({
      include: {
        deal_items: true,
        discounts: true
      },
      where: {
        seller_id: {
          in: subscribedSellers
        }
      }
    });
    return reply.code(200).send({ 
      data: deals,
      meta: {
        page: data.page,
        per_page: data.per_page
      }
    });
  }
}