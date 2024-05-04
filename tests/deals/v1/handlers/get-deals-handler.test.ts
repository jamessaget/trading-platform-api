import { FastifyReply, FastifyRequest } from "fastify";
import { GetDealsHandler } from '../../../../src/deals/v1/handlers/get-deals-hander'
import { ZodError } from "zod";
import { PrismaDatabaseClientFactory } from "../../../factories/prisma-database-client-factory";
import { UserFactory } from "../../../factories/user-factory";
import { DealFactory } from "../../../factories/deal-factory";
import { UserSellerFactory } from "../../../factories/user-seller-factory";

describe('GetDealsHandler', () => {
    it('Should return paginated deals and 200 response with meta data on success', async () => {
        const defaultPage = 1;
        const defaultPerPage = 25
        const user = UserFactory.make();
        const authorizedSeller = UserSellerFactory.make({
            user_id: user.id
        });
        const request = {
            headers: {},
            query: {},
            user_id: user.id
        };
        const deals = [
            DealFactory.make({
                seller_id: user.id
            }),
            DealFactory.make({
                seller_id: user.id
            })
        ]
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: (arg) => arg
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.user_sellers.findMany as jest.Mock).mockResolvedValue([authorizedSeller]);
        (prismaClient.deals.findMany as jest.Mock).mockResolvedValue(deals);
        const result = await new GetDealsHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        );
        expect(result).toEqual({
            data: deals,
            meta: {
                page: defaultPage,
                per_page: defaultPerPage
            }
        })
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });
    
    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make();
        const request = {
            headers: {},
            user_id: user.id,
            query: {
                page: 'abc'
            }
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new GetDealsHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        )).rejects.toThrow(ZodError);
    });
});