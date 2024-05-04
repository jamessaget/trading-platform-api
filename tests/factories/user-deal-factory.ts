import { user_deals } from "@prisma/client";
import { faker } from '@faker-js/faker';

export class UserDealFactory {
    public static make(overrides: Partial<user_deals> = {}): user_deals {
        return {
            id: faker.number.int({min: 1}),
            deal_id: faker.number.int({min: 1}),
            user_id: faker.number.int({min: 1}),
            ...overrides
        }
    }
}