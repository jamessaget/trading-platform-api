import {generalConfig} from '../../config/general';
import Queue from 'bull';
import {QueueProcessorDescriptorType} from './queue-processor-descriptor-type';

export class QueueManager {
  private static instance: QueueManager | null = null;
  private queues = {};

  private constructor() {}
  
  public static get() {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  public resolve(queueDescriptor: QueueProcessorDescriptorType) {
    if (!(queueDescriptor.queue in this.queues)) {
      console.log(`Queue ${queueDescriptor.queue} connector being created`);
      this.queues[queueDescriptor.queue] = new Queue(
        queueDescriptor.queue,
        {
          redis: {
            port: generalConfig.redis.port,
            host: generalConfig.redis.host,
            password: generalConfig.redis.password
          }
        }
      ).on('active', function(job){
        console.log(`Job ${job.id} is running`, {data: job.data});
      }).on('failed', function(job, err){
        console.log(`Job ${job.id} has failed`, {err});
      }).on('completed', function (job, result) {
        console.log(`Job ${job.id} has been completed`, {result});
      });
      this.queues[queueDescriptor.queue].process(queueDescriptor.processor);
    }
    return this.queues[queueDescriptor.queue];
  }
}