import EventEmitter from 'node:events';
import {EventsEnum} from './events-enum';
import {deals} from '@prisma/client';
import {QueueManager} from '../queues/queue-manager';
import {defaultQueueProcessorProvider} from '../queues/default-queue-processor-provider';

export class EventEmitterManager {
  private static instance: EventEmitterManager | null = null;
  private eventEmitter: EventEmitter;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.registerListeners();
  }
  
  public static get(): EventEmitterManager {
    if (!EventEmitterManager.instance) {
      EventEmitterManager.instance = new EventEmitterManager();
    }
    return EventEmitterManager.instance;
  }

  private registerListeners(): void {
    this.eventEmitter.on(EventsEnum.DEAL_UPDATED, (args: [{event_name: string, data: deals}]) => {
      QueueManager.get().resolve(defaultQueueProcessorProvider()).add(args[0]);
    });
    this.eventEmitter.on(EventsEnum.DEAL_CREATED, (args: [{event_name: string, data: deals}]) => {
      QueueManager.get().resolve(defaultQueueProcessorProvider()).add(args[0]);
    });
  }

  public emit(eventName: string, ...params): void {
    this.eventEmitter.emit(eventName, params);
  }
}
