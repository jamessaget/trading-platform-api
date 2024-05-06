import { TokenValidator } from "../../../src/core/middleware/token-validator"
import { faker } from "@faker-js/faker";
import jwt from 'jsonwebtoken'
import { generalConfig } from "../../../src/config/general";
import { FastifyReplyFactory } from "../../factories/fastify-reply-factory";
import { FastifyRequestFactory } from "../../factories/fastify-request-factory";

describe('TokenValidator', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Should return 422 if no authorization header present', async () => {
        const request = FastifyRequestFactory.make({})
        const reply = FastifyReplyFactory.make({
            send: jest.fn()
        });
        const done = jest.fn()
        new TokenValidator().validate(
            request,
            reply,
            done
        )
        expect(reply.code).toHaveBeenNthCalledWith(1, 422)
        expect(reply.send).toHaveBeenNthCalledWith(1, {
            message: 'Authorization header is required'
        })
    });

    it('Should throw an error if token is malformed and return a 401', async () => {
        const request = FastifyRequestFactory.make({
            headers: {
                authorization: `Bearer ${faker.string.sample()}`
            }
        })
        const reply = FastifyReplyFactory.make({
            send: jest.fn()
        });
        const done = jest.fn()
        new TokenValidator().validate(
            request,
            reply,
            done
        )
        expect(reply.code).toHaveBeenNthCalledWith(1, 401)
        expect(reply.send).toHaveBeenNthCalledWith(1, {message: 'Invalid token'})
    });

    it('Should throw an error if token does not contain a user_id and return a 401', async () => {
        const token = jwt.sign(
            {jti: faker.string.sample()},
            generalConfig.privateAuthKey
        )
        const request = FastifyRequestFactory.make({
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const reply = FastifyReplyFactory.make({
            send: jest.fn()
        });
        const done = jest.fn()
        new TokenValidator().validate(
            request,
            reply,
            done
        )
        expect(reply.code).toHaveBeenNthCalledWith(1, 401)
        expect(reply.send).toHaveBeenNthCalledWith(1, {message: 'Invalid token'})
    });

    it('Should add user_id to the request object when successful', async () => {
        const userId = faker.number.int({min: 1});
        const token = jwt.sign({
            data: {user_id: userId}
        }, generalConfig.privateAuthKey)
        const request = FastifyRequestFactory.make({
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        const reply = FastifyReplyFactory.make();
        const done = jest.fn()
        new TokenValidator().validate(
            request,
            reply,
            done
        )
        expect(done).toHaveBeenCalledTimes(1)
        expect(request['user_id']).toEqual(userId)
    });
});