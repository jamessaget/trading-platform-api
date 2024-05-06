import { FastifyRequest } from 'fastify';
import { DeleteWebhookHandler } from '../../../../src/webhooks/v1/handlers/delete-webhook-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';
import { DealFactory } from '../../../factories/deal-factory';
import { FastifyReplyFactory } from '../../../factories/fastify-reply-factory';
import { FastifyRequestFactory } from '../../../factories/fastify-request-factory';

describe('DeleteWebhookHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should delete a webhook by id that belongs to the authed user and send 200 on success', async () => {
        const user = UserFactory.make()
        const deal = DealFactory.make({
            seller_id: user.id
        })
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            params: {
                id: deal.id
            },
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await new DeleteWebhookHandler(prismaClient).handle(
            request as FastifyRequest<{ Params: {id: number} }> & {user_id: number},
            reply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });
});