import { FastifyRequest } from "fastify";
import {UpdateDealsValidator} from "../../../src/core/validation/update-deals-validator";
import { PrismaDatabaseClientFactory } from "../../factories/prisma-database-client-factory";
import { UserFactory } from "../../factories/user-factory";
import { DealFactory } from "../../factories/deal-factory";
import { FastifyReplyFactory } from "../../factories/fastify-reply-factory";
import { FastifyRequestFactory } from "../../factories/fastify-request-factory";

describe('UpdateDealsValidator', () => {
    it('Should throw error if request user does not own deal', async () => {
        const error = new Error('User does not have access to this deal')
        const prismaClient = PrismaDatabaseClientFactory.make();
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id + 1
        });
        (prismaClient.deals.findFirst as jest.Mock).mockResolvedValue(deal);
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            params: {
                id: deal.id
            },
        });
        request.user_id
        request.body
        const reply = FastifyReplyFactory.make();
        await expect(() => new UpdateDealsValidator(prismaClient).validate(
            request as FastifyRequest<{ Params: {id: number} }> & { user_id: number },
            reply
        )).rejects.toThrow(error)
        expect(reply.code).toHaveBeenCalledWith(401)
    });

    it('Should not show if requested user owns deal', async () => {
        const prismaClient = PrismaDatabaseClientFactory.make();
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id
        });
        (prismaClient.deals.findFirst as jest.Mock).mockResolvedValue(deal);
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            params: {
                id: deal.id
            },
        });
        const reply = FastifyReplyFactory.make();
        await expect(() => new UpdateDealsValidator(prismaClient).validate(
            request as FastifyRequest<{ Params: {id: number} }> & { user_id: number },
            reply
        )).not.toThrow()
    });
});