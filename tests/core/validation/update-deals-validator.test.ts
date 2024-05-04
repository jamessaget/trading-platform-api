import { FastifyReply, FastifyRequest } from "fastify";
import {UpdateDealsValidator} from "../../../src/core/validation/update-deals-validator";
import { PrismaDatabaseClientFactory } from "../../factories/prisma-database-client-factory";
import { UserFactory } from "../../factories/user-factory";
import { faker } from "@faker-js/faker";
import { UserTypeEnum } from "../../../src/core/enums/user-type-enum";
import { DealFactory } from "../../factories/deal-factory";

describe('UpdateDealsValidator', () => {
    it('Should throw error if request user does not own deal', async () => {
        const error = new Error('User does not have access to this deal')
        const prismaClient = PrismaDatabaseClientFactory.make();
        const user = UserFactory.make();
        const deal = DealFactory.make({
            seller_id: user.id + 1
        });
        (prismaClient.deals.findFirst as jest.Mock).mockResolvedValue(deal);
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
        await expect(() => new UpdateDealsValidator(prismaClient).validate(
            request as unknown as FastifyRequest<{ Params: {id: number} }> & { user_id: number },
            reply as unknown as FastifyReply
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
        await expect(() => new UpdateDealsValidator(prismaClient).validate(
            request as unknown as FastifyRequest<{ Params: {id: number} }> & { user_id: number },
            reply as unknown as FastifyReply
        )).not.toThrow()
    });
});