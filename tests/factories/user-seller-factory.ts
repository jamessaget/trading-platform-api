import { user_sellers } from "@prisma/client";
import { faker } from '@faker-js/faker';

export class UserSellerFactory {
    public static make(overrides: Partial<user_sellers> = {}): user_sellers {
        return {
            id: faker.number.int({min: 1}),
            seller_id: faker.number.int({min: 1}),
            user_id: faker.number.int({min: 1}),
            ...overrides
        }
    }
}