import {QueueProcessorDescriptorType} from './queue-processor-descriptor-type';
import {PrismaDatabaseClientFactory} from '../database/prisma-database-client-factory';
import {PrismaClient, deals} from '@prisma/client';
import crypto from 'crypto';
import {QueueEnum} from './queue-enum';
import {DoneCallback, Job} from 'bull';
import fetch from 'node-fetch';

export const defaultQueueProcessorProvider: (prismaClient?: PrismaClient) => QueueProcessorDescriptorType<{event_name: string, data: deals}> = (prismaClient = PrismaDatabaseClientFactory.get().resolve()) => ({
  queue: QueueEnum.DEFAULT_QUEUE,
  processor: async (job: Job, done: DoneCallback) => {
    try {
      const subscribers = await prismaClient.user_sellers.findMany({
        where: {
          seller_id: job.data.data.seller_id
        }
      });
      for (const subscriber of subscribers) {
        const webhooks = await prismaClient.webhooks.findMany({
          where: {
            user_id: subscriber.user_id
          }
        });
        await Promise.all(webhooks.map(async (webhook) => {
          await fetch(webhook.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json',
              'X-Trading-Platform-Hmac': crypto.createHmac('sha256', webhook.client_secret)
                .update(JSON.stringify({
                  event: job.data.event_name,
                  data: job.data.data
                }), 'utf-8')
                .digest('hex')
            },
            body: JSON.stringify({
              event: job.data.event_name,
              data: job.data.data
            })
          });
        }));
      }
    } catch (error) {
      console.log(error);
      return done(error);
    }
    done(null, job.data);
  }
});