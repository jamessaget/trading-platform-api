import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { CreateWebhookHandler } from '../../../../src/webhooks/v1/handlers/create-webhook-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';
import { faker } from '@faker-js/faker';
import { WebhookFactory } from '../../../factories/webhook-factory'

describe('CreateWebhookHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should create a webhook for auth user and send 201 on success', async () => {
        const user = UserFactory.make()
        const webhook = WebhookFactory.make({
            user_id: user.id
        })
        const request = {
            headers: {},
            body: {
              webhook_url: webhook.webhook_url,
              name: webhook.name  
            },
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.webhooks.create as jest.Mock).mockResolvedValue(webhook);
        await new CreateWebhookHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 201)
    });

    it('Should throw zod error on failed validation', async () => {
        const user = UserFactory.make()
        const request = {
            headers: {},
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateWebhookHandler(prismaClient).handle(
            request as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        )).rejects.toThrow(ZodError);
    });
});