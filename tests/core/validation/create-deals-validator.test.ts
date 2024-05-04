import { FastifyReply, FastifyRequest } from "fastify";
import {CreateDealsValidator} from "../../../src/core/validation/create-deals-validator";
import { PrismaDatabaseClientFactory } from "../../factories/prisma-database-client-factory";
import { UserFactory } from "../../factories/user-factory";
import { faker } from "@faker-js/faker";
import { UserTypeEnum } from "../../../src/core/enums/user-type-enum";

describe('CreateDealsValidator', () => {
    it('Should throw error if user is not a seller', async () => {
        const error = new Error('Only sellers allowed')
        const prismaClient = PrismaDatabaseClientFactory.make();
        const user = UserFactory.make();
        (prismaClient.users.findFirst as jest.Mock).mockResolvedValue(user);
        const request = {
            headers: {},
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        await expect(() => new CreateDealsValidator(prismaClient).validate(
            request as unknown as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        )).rejects.toThrow(error)
        expect(reply.code).toHaveBeenCalledWith(401)
    });

    it('Should return when user is a seller', async () => {
        const prismaClient = PrismaDatabaseClientFactory.make();
        const user = UserFactory.make({
            users_type_relation: [{
                id: faker.number.int({min: 1}),
                type_id: faker.number.int({min: 1}),
                user_id: faker.number.int({min: 1}),
                user_types: {
                    id: faker.number.int({min: 1}),
                    type: UserTypeEnum.SELLER.toUpperCase()
                },
            }]
        });
        (prismaClient.users.findFirst as jest.Mock).mockResolvedValue(user);
        const request = {
            headers: {},
            user_id: user.id
        };
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        await expect(() => new CreateDealsValidator(prismaClient).validate(
            request as unknown as FastifyRequest & {user_id: number},
            reply as unknown as FastifyReply
        )).not.toThrow()
    });
});