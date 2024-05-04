import { PrismaDatabaseClientFactory } from "../../../src/core/database/prisma-database-client-factory"
import { PrismaClient } from "@prisma/client";

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn()
}))

describe('PrismaDatabaseClientFactory', () => {
    it('Will always return the same instance once initialised', async () => {
        const instance = PrismaDatabaseClientFactory.get()
        const instance2 = PrismaDatabaseClientFactory.get()
        instance.resolve();
        instance.resolve();
        instance2.resolve()
        expect(PrismaClient).toHaveBeenCalledTimes(1)
    });
});