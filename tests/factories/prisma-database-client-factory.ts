import { PrismaClient } from '@prisma/client';

export class PrismaDatabaseClientFactory {
    public static make(overrides: Partial<PrismaClient> = {}): PrismaClient {
        return {
            user_sellers: {
                findMany: jest.fn(),
            },
            webhooks:{
                create: jest.fn(),
                delete: jest.fn(),
                findMany: jest.fn(),
            },
            user_types: {
                findMany: jest.fn(),
            },
            users: {
                create: jest.fn(),
                findFirst: jest.fn()
            },
            deals: {
                create: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                findMany: jest.fn()
            },
            discounts: {
                upsert: jest.fn(),
            },
            ...overrides
          } as PrismaClient;
    }
}