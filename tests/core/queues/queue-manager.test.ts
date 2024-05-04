import { QueueManager } from "../../../src/core/queues/queue-manager";
import Queue from 'bull'
import { QueueProcessorDescriptorType } from "../../../src/core/queues/queue-processor-descriptor-type";
import { faker } from '@faker-js/faker';
import { generalConfig } from "../../../src/config/general";

jest.mock('bull', () => jest.fn( () => ({
    on: jest.fn().mockReturnThis(),
    process: jest.fn()
})))

describe('QueueManager', () => {
    it('Will always resolve to the same queueDescriptor once registered and return', async () => {
        const queueDescriptor: QueueProcessorDescriptorType = {
            queue: faker.string.sample(),
            processor: jest.fn()
        }
        const instance = QueueManager.get()
        const instance2 = QueueManager.get()
        instance.resolve(queueDescriptor)
        instance.resolve(queueDescriptor)
        instance2.resolve(queueDescriptor)
        expect(Queue).toHaveBeenNthCalledWith(1, queueDescriptor.queue, {
            redis: {
                port: generalConfig.redis.port,
                host: generalConfig.redis.host,
                password: generalConfig.redis.password
            }
        })
    });
});