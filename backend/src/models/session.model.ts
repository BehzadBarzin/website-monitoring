import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError, SaveOptions, Model } from 'mongoose';

// ===================================================================================================
// Create a TypeScript type for the Session model

export interface ISession extends Document {
    user: Schema.Types.ObjectId,
    valid: boolean,
    userAgent: string,
    createdAt: Date,
    updatedAt: Date,
}


// Create a new Model type with the basic interfaces defined above:
type SessionModel = Model<ISession, {}, {}>;

// ===================================================================================================
// User Schema (MongoDB)
const sessionSchema = new Schema<ISession, SessionModel, {}>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }, 
    valid: {
        type: Boolean,
        default: true,
    },
    userAgent: {
        type: String,
    }
}, {
    timestamps: true,
});

// ===================================================================================================
// Create model from schema
const Session = mongoose.model<ISession, SessionModel>('Session', sessionSchema);
// ===================================================================================================

export default Session;