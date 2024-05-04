import { deals, discounts } from "@prisma/client";
import { faker } from '@faker-js/faker';

export class DiscountFactory {
    public static make(overrides: Partial<discounts> = {}): discounts {
        return {
            id: faker.number.int({min: 1}),
            type: 'flat',
            amount: faker.number.int({min: 1}),
            ...overrides
        }
    }
}