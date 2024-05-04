import { EventsEnum } from "../../../src/core/events/events-enum";
import { defaultQueueProcessorProvider } from "../../../src/core/queues/default-queue-processor-provider";
import { DealFactory } from "../../factories/deal-factory";
import { JobFactory } from "../../factories/job-factory";
import { PrismaDatabaseClientFactory } from "../../factories/prisma-database-client-factory";
import fetch from "node-fetch";
import { WebhookFactory } from "../../factories/webhook-factory";
import crypto from 'crypto'
import { UserSellerFactory } from "../../factories/user-seller-factory";

jest.mock('node-fetch')

describe('DefaultQueueProcessorProvider', () => {
    afterEach(() => {
		jest.resetAllMocks()
	})

    it('Will send not retreive webhooks if no users are authorized to see that deal', async () => {
        const doneCallback = jest.fn()
        const prismaClient = PrismaDatabaseClientFactory.make();
        (prismaClient.user_sellers.findMany as jest.Mock).mockResolvedValue([])
        await defaultQueueProcessorProvider(prismaClient).processor(JobFactory.make({
            data: {
                event_name: EventsEnum.DEAL_CREATED,
                data: DealFactory.make()
                
            }
        }), doneCallback);
        expect(prismaClient.user_sellers.findMany).toHaveBeenCalledTimes(1)
        expect(prismaClient.webhooks.findMany).not.toHaveBeenCalled()

    })

    it('Will send not send webhooks if none found for that user', async () => {
        const prismaClient = PrismaDatabaseClientFactory.make();
        const doneCallback = jest.fn()
        const userSeller = UserSellerFactory.make();
        (prismaClient.user_sellers.findMany as jest.Mock).mockResolvedValue([
            userSeller
        ]);
        (prismaClient.webhooks.findMany as jest.Mock).mockResolvedValue([]);
        await defaultQueueProcessorProvider(prismaClient).processor(JobFactory.make({
            data: {
                event_name: EventsEnum.DEAL_CREATED,
                data: DealFactory.make()
                
            }
        }), doneCallback);
        expect(prismaClient.user_sellers.findMany).toHaveBeenCalledTimes(1)
        expect(prismaClient.webhooks.findMany).toHaveBeenCalledTimes(1)
        expect(fetch).not.toHaveBeenCalled()
    })

    it('Will send requests to webhooks for all users that are authorized to see that deal', async () => {
        const prismaClient = PrismaDatabaseClientFactory.make();
        const doneCallback = jest.fn()
        const deal = DealFactory.make();
        // @todo think
        const userDeal = UserSellerFactory.make({deal_id: deal.id});
        const webhook = WebhookFactory.make({user_id: userDeal.user_id});
        const job = JobFactory.make({
            data: {
                event_name: EventsEnum.DEAL_CREATED,
                data: deal
            }
        });
        (prismaClient.user_sellers.findMany as jest.Mock).mockResolvedValue([
            userDeal
        ]);
        (prismaClient.webhooks.findMany as jest.Mock).mockResolvedValue([
            webhook
        ]);
        await defaultQueueProcessorProvider(prismaClient).processor(job, doneCallback);
        expect(prismaClient.user_sellers.findMany).toHaveBeenCalledTimes(1)
        expect(prismaClient.webhooks.findMany).toHaveBeenCalledTimes(1)
        expect(fetch).toBeCalledWith(webhook.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json',
              'X-Trading-Platform-Hmac': crypto.createHmac('sha256', webhook.client_secret)
                .update(JSON.stringify({
                  event: job.data.event_name,
                  data: job.data.data
                }), "utf-8")
                .digest("hex")
            },
            body: JSON.stringify({
              event: job.data.event_name,
              data: job.data.data
            })
          })
    });
});
