import { faker } from '@faker-js/faker';
import { Job } from "bull";

export class JobFactory {
    public static make(overrides: Partial<Job> = {}): Job {
        return {
            data: {},
            opts: {},
            id: faker.number.int(),
            progress: jest.fn(),
            attemptsMade: 0,
            ...overrides
          } as unknown as Job;
    }
}