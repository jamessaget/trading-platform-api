import { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { DealUpdatedEvent } from "../../../../src/core/events/deal-updated-event";
import { UpdateDealsHandler } from "../../../../src/deals/v1/handlers/update-deals-hander";
import { DealFactory } from "../../../factories/deal-factory";
import { PrismaDatabaseClientFactory } from "../../../factories/prisma-database-client-factory";
import { UserFactory } from "../../../factories/user-factory";

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
        const request = {
            headers: {},
            params: {
                id: deal.id
            },
            user_id: user.id,
            body: {
                name: deal.name,
                currency: deal.currency,
                status: deal.status,
                total_price: deal.total_price,
            }
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.deals.update as jest.Mock).mockResolvedValue(deal);
        await new UpdateDealsHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply as unknown as FastifyReply
        );
        expect(DealUpdatedEvent.prototype.constructor).toHaveBeenCalledTimes(1)
        expect(prismaClient.deals.update).toHaveBeenCalledTimes(1)
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });

    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id
        });
        const request = {
            headers: {},
            params: {
                id: deal.id
            },
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new UpdateDealsHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply as unknown as FastifyReply
        )).rejects.toThrow(ZodError);
    });
});