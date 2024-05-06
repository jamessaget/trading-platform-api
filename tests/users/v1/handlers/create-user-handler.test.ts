import { ZodError } from 'zod';
import { CreateUserHandler } from '../../../../src/users/v1/handlers/create-user-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';
import { FastifyReplyFactory } from '../../../factories/fastify-reply-factory';
import { FastifyRequestFactory } from '../../../factories/fastify-request-factory';

describe('CreateUserHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should create a new user and send 201 on success', async () => {
        const user = UserFactory.make()
        const request = FastifyRequestFactory.make({
            body: {
                name: user.name,
                password: user.password,
                email: user.email,
                user_type: ['buyer']
            }
        });
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.user_types.findMany as jest.Mock).mockResolvedValue([]);
        await new CreateUserHandler(prismaClient).handle(
            request,
            reply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 201)
    });

    it('Should throw zod error on failed validation', async () => {
        const request = FastifyRequestFactory.make({})
        const reply = FastifyReplyFactory.make();
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateUserHandler(prismaClient).handle(
            request,
            reply
        )).rejects.toThrow(ZodError);
    });
});