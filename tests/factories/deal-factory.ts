import { deals } from "@prisma/client";
import { faker } from '@faker-js/faker';

export class DealFactory {
    public static make(overrides: Partial<deals> = {}): deals {
        return {
            id: faker.number.int({min: 1}),
            name: faker.string.sample(),
            seller_id: faker.number.int({min: 1}),
            currency: faker.string.sample(),
            status: 'available',
            discount_id: faker.number.int({min: 1}),
            total_price: faker.number.int({min: 1}),
            ...overrides
        }
    }
}