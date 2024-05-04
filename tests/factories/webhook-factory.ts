import { webhooks } from "@prisma/client";
import { faker } from '@faker-js/faker';

export class WebhookFactory {
    public static make(overrides: Partial<webhooks> = {}): webhooks {
        return {
            id: faker.number.int({min: 1}),
            webhook_url: faker.string.sample(),
            user_id: faker.number.int({min: 1}),
            name: faker.string.sample(),
            client_secret: faker.string.sample(),
            ...overrides
        }
    }
}