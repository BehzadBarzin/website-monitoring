import mongoose, { Schema, Document, Model, CallbackWithoutResultAndOptionalError, SaveOptions } from 'mongoose';
import State, { EStateFields } from './state.model';
import log from '../utils/logger.util';
import Website from './website.model';
import changeEmitter, { EEvents } from '../events/change_emitter';

// ===================================================================================================
// Create a TypeScript type for the model

export interface IChange extends Document {
    website: Schema.Types.ObjectId,
    previousState: Schema.Types.ObjectId,
    currentState: Schema.Types.ObjectId,
    fields: EStateFields[],
    createdAt?: Date,
    updatedAt?: Date,
}

// Create a new Model type with the basic interfaces defined above:
type ChangeModel = Model<IChange, {}, {}>;
// ===================================================================================================
// Schema (MongoDB)
const changeSchema = new Schema<IChange, ChangeModel, {}>({
    website: {
        type: Schema.Types.ObjectId,
        ref: 'Website',
    },
    previousState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
    },
    currentState: {
        type: Schema.Types.ObjectId,
        ref: 'State',
    },
    fields: {
        type: [String],
        enum: EStateFields,
        required: true
    }
}, {
    timestamps: true,
});

// ===================================================================================================
// Called when a new Change is being saved

changeSchema.pre<IChange>('save', {document: true}, async function(this: IChange, next: CallbackWithoutResultAndOptionalError, options: SaveOptions) {
    
    // Emit a new Change event
    changeEmitter.emit(EEvents.CHANGE, this);
    
    return next();
});
// ===================================================================================================
// Create model from schema
const Change = mongoose.model<IChange, ChangeModel>('Change', changeSchema);
// ===================================================================================================

export default Change;