import {PrismaClient} from '@prisma/client';
import {PrismaDatabaseClientFactory} from '../../../core/database/prisma-database-client-factory';
import {createWebhookHttpSchema} from '../../../core/schema/create-webhook-http-schema';
import crypto from 'crypto';
import {FastifyRequest, FastifyReply} from 'fastify';

export class CreateWebhookHandler {
  private prismaClient: PrismaClient;
    
  constructor(prismaClient = PrismaDatabaseClientFactory.get().resolve()
  ) {
    this.prismaClient = prismaClient;
  }

  public async handle(
    request: FastifyRequest & {user_id: number},
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const data = createWebhookHttpSchema.parse(request.body);
    const webhook = await this.prismaClient.webhooks.create({
      data: {
        webhook_url: data.webhook_url,
        name: data.name,
        user_id: request.user_id,
        client_secret: crypto.randomUUID()
      }
    });
    return reply.code(201).send({
      data: {
        secret: webhook.client_secret
      }
    });
  }
}