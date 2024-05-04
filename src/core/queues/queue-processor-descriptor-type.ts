import {DoneCallback, Job} from 'bull';

export type QueueProcessorDescriptorType<T = unknown> = {
    queue: string,
    processor: (job: Job<T>, done: DoneCallback) => Promise<void>
}