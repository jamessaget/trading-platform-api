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
    const deal = await this.prismaClient.$transaction(async (trx) => {
      if (Object.prototype.hasOwnProperty.call(data, 'discount')) {
        let discountId = null;
        if (data.discount !== null) {
          discountId = (await trx.discounts.upsert({
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
        await trx.deals.update({
          where: {
            id: +request.params.id
          },
          data: {
            discount_id: discountId
          }
        });
      }
      if (Object.prototype.hasOwnProperty.call(data, 'deal_items')) {
        await trx.deal_items.deleteMany({
          where: {
            deal_id: +request.params.id
          }
        });
        await trx.deal_items.createMany({
          data: data.deal_items.map(dealItem => ({
            name: dealItem.name,
            price: dealItem.price,
            deal_id: +request.params.id
          })),
          skipDuplicates: true,
        });
        await trx.deals.update({
          where: {
            id: +request.params.id
          },
          data: {
            total_price: (await trx.deal_items.findMany({
              where: {
                deal_id: +request.params.id
              }
            })).reduce((acc, curr) => acc + curr.price, 0)
          }
        });
      }
      return trx.deals.update({
        include: {
          deal_items: true,
          discounts: true
        },
        where: {
          id: +request.params.id
        },
        data: Object.fromEntries(Object.entries(data).filter(([key]) => !['deal_items', 'discount'].includes(key)))
      });
    });
    new DealUpdatedEvent().emit(deal);
    return reply.code(200).send({
      data: deal
    });
  }
}