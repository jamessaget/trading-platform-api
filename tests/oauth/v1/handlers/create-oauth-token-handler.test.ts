import { ZodError } from 'zod';
import { CreateOAuthTokenHandler } from '../../../../src/oauth/v1/handlers/create-oauth-token-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { faker } from '@faker-js/faker';
import { UserFactory } from '../../../factories/user-factory';
import bcrypt from 'bcrypt';
import { ApplicationClientError } from '../../../../src/core/errors/application-client-error';
import { generalConfig } from '../../../../src/config/general';
import { FastifyReplyFactory } from '../../../factories/fastify-reply-factory';
import { FastifyRequestFactory } from '../../../factories/fastify-request-factory';

describe('CreateOAuthTokenHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should supply an auth token when the user details match', async () => {
        const user = UserFactory.make()
        const request = FastifyRequestFactory.make({}, {
            body: {
                username: user.email,
                password: user.password,
                grant_type: 'password'
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.users.findFirst as jest.Mock).mockResolvedValue({
            ...user,
            password: await new Promise((resolve, reject) => {
                bcrypt.hash(user.password, generalConfig.passwordSalt, (err, hash) => {
                  if (err) reject(err);
                  resolve(hash);
                })
            })
        });
        const result = await new CreateOAuthTokenHandler(prismaClient).handle(
            request,
            reply
        );
        expect(result['data']['token']).toBeTruthy()
        expect(reply.code).toHaveBeenNthCalledWith(1, 200)
    });

    it('Should throw ApplicationClientError on failed password match', async () => {
        const user = UserFactory.make()
        const request = FastifyRequestFactory.make({
            body: {
                username: faker.string.sample(),
                password: faker.string.sample(),
                grant_type: 'password'
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.users.findFirst as jest.Mock).mockResolvedValue(user);
        await expect(() => new CreateOAuthTokenHandler(prismaClient).handle(
            request,
            reply
        )).rejects.toThrow(ApplicationClientError);
    });

    it('Should throw zod error on failed validation', async () => {
        const request = FastifyRequestFactory.make({})
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateOAuthTokenHandler(prismaClient).handle(
            request,
            reply
        )).rejects.toThrow(ZodError);
    });
});