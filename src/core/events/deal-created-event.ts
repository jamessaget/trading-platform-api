import {deals} from '@prisma/client';
import {EventEmitterManager} from './event-emitter-manager';
import {EventsEnum} from './events-enum';

export class DealCreatedEvent {
  public emit(deal: deals): void {
    EventEmitterManager.get().emit(EventsEnum.DEAL_CREATED, {
      event_name: EventsEnum.DEAL_CREATED,
      data: deal
    });
  }
}