import { FastifyRequest, FastifyReply } from 'fastify';
import { DeleteWebhookHandler } from '../../../../src/webhooks/v1/handlers/delete-webhook-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';
import { DealFactory } from '../../../factories/deal-factory';

describe('DeleteWebhookHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should delete a webhook by id that belongs to the authed user and send 200 on success', async () => {
        const user = UserFactory.make()
        const deal = DealFactory.make({
            seller_id: user.id
        })
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
        await new DeleteWebhookHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply as unknown as FastifyReply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });
});