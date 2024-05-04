import { EventEmitterManager } from "../../../src/core/events/event-emitter-manager"
import EventEmitter from 'node:events';

jest.mock('node:events')

describe('EventEmitterManager', () => {
    it('Will ensure listeners are only registered once', async () => {
        const mockEventListenerRegister = jest.fn()
        jest.spyOn(
            EventEmitter.prototype,
            'on',
          ).mockImplementation(mockEventListenerRegister)        
        EventEmitterManager.get()
        EventEmitterManager.get()
        EventEmitterManager.get()
        EventEmitterManager.get()
        EventEmitterManager.get()
        expect(mockEventListenerRegister).toHaveBeenCalledTimes(2)
    });
});