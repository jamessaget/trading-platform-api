import { GetDealsHandler } from '../../../../src/deals/v1/handlers/get-deals-hander'
import { ZodError } from "zod";
import { PrismaDatabaseClientFactory } from "../../../factories/prisma-database-client-factory";
import { UserFactory } from "../../../factories/user-factory";
import { DealFactory } from "../../../factories/deal-factory";
import { UserSellerFactory } from "../../../factories/user-seller-factory";
import { FastifyReplyFactory } from "../../../factories/fastify-reply-factory";
import { FastifyRequestFactory } from "../../../factories/fastify-request-factory";

describe('GetDealsHandler', () => {
    it('Should return paginated deals and 200 response with meta data on success', async () => {
        const defaultPage = 1;
        const defaultPerPage = 25
        const user = UserFactory.make();
        const authorizedSeller = UserSellerFactory.make({
            user_id: user.id
        });
        const request = FastifyRequestFactory.make({
            user_id: user.id
        });
        const deals = [
            DealFactory.make({
                seller_id: user.id
            }),
            DealFactory.make({
                seller_id: user.id
            })
        ]
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.user_sellers.findMany as jest.Mock).mockResolvedValue([authorizedSeller]);
        (prismaClient.deals.findMany as jest.Mock).mockResolvedValue(deals);
        const result = await new GetDealsHandler(prismaClient).handle(
            request,
            reply
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
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            query: {
                page: 'abc'
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new GetDealsHandler(prismaClient).handle(
            request,
            reply
        )).rejects.toThrow(ZodError);
    });
});