import { FastifyReply } from 'fastify';

export class FastifyReplyFactory {
    public static make(overrides: Partial<FastifyReply> = {}): FastifyReply {
        return {
            code: jest.fn().mockReturnThis(),
            send: (args) => args,
            ...overrides
          } as FastifyReply;
    }
}