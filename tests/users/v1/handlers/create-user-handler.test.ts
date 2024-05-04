import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { CreateUserHandler } from '../../../../src/users/v1/handlers/create-user-hander'
import { PrismaDatabaseClientFactory } from '../../../factories/prisma-database-client-factory';
import { UserFactory } from '../../../factories/user-factory';

describe('CreateUserHandler', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should create a new user and send 201 on success', async () => {
        const user = UserFactory.make()
        const request = {
            headers: {},
            body: {
                name: user.name,
                password: user.password,
                email: user.email,
                user_type: ['buyer']
            }
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.user_types.findMany as jest.Mock).mockResolvedValue([]);
        await new CreateUserHandler(prismaClient).handle(
            request as FastifyRequest,
            reply as unknown as FastifyReply
        );
        expect(reply.code).toHaveBeenNthCalledWith(1, 201)
    });

    it('Should throw zod error on failed validation', async () => {
        const request = {
            headers: {},
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const prismaClient = PrismaDatabaseClientFactory.make();
        await expect(() => new CreateUserHandler(prismaClient).handle(
            request as FastifyRequest,
            reply as unknown as FastifyReply
        )).rejects.toThrow(ZodError);
    });
});