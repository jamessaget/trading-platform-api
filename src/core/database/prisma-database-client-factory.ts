import {PrismaClient} from '@prisma/client';

export class PrismaDatabaseClientFactory {
  private static instance: PrismaDatabaseClientFactory|null = null;
  private client: PrismaClient|null = null;

  private constructor() {}
  
  public static get() {
    if (!PrismaDatabaseClientFactory.instance) {
      PrismaDatabaseClientFactory.instance = new PrismaDatabaseClientFactory();
    }
    return PrismaDatabaseClientFactory.instance;
  }

  public resolve() {
    if (!this.client) {
      this.client = new PrismaClient();
    }
    return this.client;
  }

}