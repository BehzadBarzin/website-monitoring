import EventEmitter from 'events';
import { IChange } from '../models/change.model';
import TypedEventEmitter from './typed_event_emitter';

export enum EEvents {
    CHANGE = 'change',
}

// Define emitter's types:
//     Key: Event name; 
//     Value: Listener function signature
type ChangeEvents = {
  error: (error: Error) => void,
  [EEvents.CHANGE]: (change: IChange) => void,
}

const changeEmitter = new EventEmitter() as TypedEventEmitter<ChangeEvents>;

export default changeEmitter;