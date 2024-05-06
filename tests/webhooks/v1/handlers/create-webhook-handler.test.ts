import { ZodError } from 'zod';
import { CreateWebhookHandler } from '../../../../src/webhooks/v1/handlers/create-webhook-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';
import { WebhookFactory } from '../../../factories/webhook-factory'
import { FastifyReplyFactory } from '../../../factories/fastify-reply-factory';
import { FastifyRequestFactory } from '../../../factories/fastify-request-factory';

describe('CreateWebhookHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should create a webhook for auth user and send 201 on success', async () => {
        const user = UserFactory.make()
        const webhook = WebhookFactory.make({
            user_id: user.id
        })
        const request = FastifyRequestFactory.make({user_id: user.id}, {
            body: {
              webhook_url: webhook.webhook_url,
              name: webhook.name  
            },
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.webhooks.create as jest.Mock).mockResolvedValue(webhook);
        await new CreateWebhookHandler(prismaClient).handle(
            request,
            reply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 201)
    });

    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make()
        const request = FastifyRequestFactory.make({
            user_id: user.id
        }, {});
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateWebhookHandler(prismaClient).handle(
            request,
            reply
        )).rejects.toThrow(ZodError);
    });
});