import { faker } from '@faker-js/faker';
import { users } from '@prisma/client';

export class UserFactory {
    public static make(overrides: Partial<users & {
        users_type_relation: Array<{
            id: number,
            type_id: number,
            user_id: number
            user_types: {
                id: number,
                type: string
            } | null
        }>
    }> = {}): users & {
        users_type_relation: Array<{
        id: number,
        type_id: number,
        user_id: number
        user_types: {
            id: number,
            type: string
        } | null
    }>} {
        return {
            id: faker.number.int({min: 1}),
            name: faker.string.sample(),
            email: faker.string.sample(),
            password: faker.string.sample(),
            created_at: faker.date.anytime(),
            updated_at: faker.date.anytime(),
            users_type_relation: [],
            ...overrides
          };
    }
}