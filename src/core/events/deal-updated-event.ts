import {deals} from '@prisma/client';
import {EventsEnum} from './events-enum';
import {EventEmitterManager} from './event-emitter-manager';

export class DealUpdatedEvent {
  public emit(deal: deals): void {
    EventEmitterManager.get().emit(EventsEnum.DEAL_UPDATED, {
      event_name: EventsEnum.DEAL_UPDATED,
      data: deal
    });
  }
}