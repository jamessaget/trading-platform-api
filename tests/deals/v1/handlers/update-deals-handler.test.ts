import { FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { DealUpdatedEvent } from "../../../../src/core/events/deal-updated-event";
import { UpdateDealsHandler } from "../../../../src/deals/v1/handlers/update-deals-hander";
import { DealFactory } from "../../../factories/deal-factory";
import { PrismaDatabaseClientFactory } from "../../../factories/prisma-database-client-factory";
import { UserFactory } from "../../../factories/user-factory";
import { FastifyReplyFactory } from "../../../factories/fastify-reply-factory";
import { FastifyRequestFactory } from "../../../factories/fastify-request-factory";

jest.mock('../../../../src/core/events/deal-updated-event', () => ({
    DealUpdatedEvent: jest.fn(() => ({
        emit: jest.fn()
    }))
}))

describe('UpdateDealsHandler', () => {
    it('Should update a deal emit DealUpdatedEvent and send 200 on success', async () => {
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id
        });
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            params: {
                id: deal.id
            },
            body: {
                name: deal.name,
                currency: deal.currency,
                status: deal.status,
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.$transaction as jest.Mock).mockResolvedValue(deal);
        await new UpdateDealsHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply
        );
        expect(DealUpdatedEvent.prototype.constructor).toHaveBeenCalledTimes(1)
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });

    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id
        });
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            params: {
                id: deal.id
            },
            body: {
                total_price: 1000000
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new UpdateDealsHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply
        )).rejects.toThrow(ZodError);
    });
});