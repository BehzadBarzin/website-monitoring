import mongoose, { Schema, Document, Model } from 'mongoose';

// ===================================================================================================
// Create a TypeScript type for the model

export enum EStateFields {
    content = 'content',
    loadTime = 'loadTime',
    status = 'status',
}

export interface IStateInsert {
    website: Schema.Types.ObjectId,
    content: string,
    loadTime: number,
    status: number,
}

export interface IState extends Document {
    website: Schema.Types.ObjectId,
    content: string,
    loadTime: number,
    status: number,
    createdAt: Date,
    updatedAt: Date,
}

// Create a new Model type with the basic interfaces defined above:
type StateModel = Model<IState, {}, {}>;
// ===================================================================================================
// Schema (MongoDB)
const stateSchema = new Schema<IState, StateModel, {}>({
    website: {
        type: Schema.Types.ObjectId,
        ref: 'Website',
    },
    content: {
        type: String,
        required: false,
    },
    loadTime: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

// ===================================================================================================
// Create model from schema
const State = mongoose.model<IState, StateModel>('State', stateSchema);
// ===================================================================================================

export default State;