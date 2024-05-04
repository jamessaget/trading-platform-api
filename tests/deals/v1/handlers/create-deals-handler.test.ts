import { FastifyReply, FastifyRequest } from "fastify";
import { CreateDealsHandler } from '../../../../src/deals/v1/handlers/create-deals-hander'
import { PrismaDatabaseClientFactory } from "../../../factories/prisma-database-client-factory";
import { UserFactory } from "../../../factories/user-factory";
import { ZodError } from "zod";
import { faker } from "@faker-js/faker";
import { DealFactory } from "../../../factories/deal-factory";
import { DiscountFactory } from "../../../factories/discount-factory";
import { DealCreatedEvent } from "../../../../src/core/events/deal-created-event";

jest.mock('../../../../src/core/events/deal-created-event', () => ({
    DealCreatedEvent: jest.fn(() => ({
        emit: jest.fn()
    }))
}))

describe('CreateDealsHandler', () => {
    it('Should create a deal with discounts, emit DealCreatedEvent and send 201 on success', async () => {
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id
        });
        const discount = DiscountFactory.make();
        const request = {
            headers: {},
            user_id: user.id,
            body: {
                name: deal.name,
                currency: deal.currency,
                status: deal.status,
                total_price: deal.total_price,
                discount: discount,
                deal_items: [
                  {
                    name: faker.string.sample(),
                    price: faker.number.int({min: 1})
                  }
                ]
            }
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.discounts.upsert as jest.Mock).mockResolvedValue(discount);
        (prismaClient.deals.create as jest.Mock).mockResolvedValue(deal);
        await new CreateDealsHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        );
        expect(DealCreatedEvent.prototype.constructor).toHaveBeenCalledTimes(1)
        expect(prismaClient.discounts.upsert).toHaveBeenCalledTimes(1)
        expect(prismaClient.deals.create).toHaveBeenCalledTimes(1)
        expect(reply.code).toHaveBeenNthCalledWith(1, 201)
    });

    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make();
        const request = {
            headers: {},
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateDealsHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        )).rejects.toThrow(ZodError);
    });
});