import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {DealCreatedEvent} from '../../../core/events/deal-created-event';
import {createDealHttpSchema} from '../../../core/schema/create-deal-http-schema';
import {FastifyReply, FastifyRequest} from 'fastify';

export class CreateDealsHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest & {user_id: number},
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = createDealHttpSchema.parse(request.body);
    let discountId: number | null = null;
    if (data?.discount) {
      discountId =  (await this.prismaClient.discounts.upsert({
        where: {
          type_amount: {
            amount: data.discount.amount,
            type: data.discount.type
          }
        },
        update: {},
        create: {
          amount: data.discount.amount,
          type: data.discount.type
        }
      })).id;
    }
    const deal = await this.prismaClient.deals.create({
      include: {
        discounts: true,
        deal_items: true,
      },
      data: {
        name: data.name,
        seller_id: request.user_id,
        currency: data.currency,
        status: data.status,
        total_price: data.deal_items.reduce((acc, curr) => acc + curr.price, 0),
        discount_id: discountId,
        deal_items: {
          create: data.deal_items.map(dealItem => ({
            name: dealItem.name,
            price: dealItem.price
          }))
        }
      }
    });
    new DealCreatedEvent().emit(deal);
    return reply.code(201).send({
      data: deal
    });
  }
}