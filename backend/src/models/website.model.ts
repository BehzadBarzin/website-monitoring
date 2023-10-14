import mongoose, { Schema, Document, Model } from 'mongoose';
import State, { EStateFields, IState, IStateInsert } from './state.model';
import { getState } from '../utils/get_state.util';
import { changedFields } from '../utils/compare_states.util';
import Change, { IChange } from './change.model';
import log from '../utils/logger.util';

// ===================================================================================================
// Create a TypeScript type for the model

export interface IWebsite extends Document {
    address: string,
    createdAt?: Date,
    updatedAt?: Date,
}

// Put all user instance methods in this interface:
interface IWebsiteMethods {
    getChange(): Promise<IChange | null>;
}

// Create a new Model type with the basic interfaces defined above:
type WebsiteModel = Model<IWebsite, {}, IWebsiteMethods>;
// ===================================================================================================
// Schema (MongoDB)
const websiteSchema = new Schema<IWebsite, WebsiteModel, {}>({
    address: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

// ===================================================================================================
// Add utility method to model to easily compare password with hashed password from db
websiteSchema.method<IWebsite>('getChange', async function(this: IWebsite) {
    // Get an IStateInsert to later insert into db (if changes happened)
    const state: IStateInsert | null = await getState(this);

    if (!state) {
        return null;
    }

    // Get previous state
    const previousState = await State.findOne({
        website: this._id,
    }, {}, {
        sort: { createdAt: -1 }
    }).lean();

    // If this is the first state for this website, create the current state
    if (!previousState) {
        // Insert new state into db
        await State.create({
            ...state,
        });
        return null;
    }

    // Compare the new state with the previous one
    const changed: EStateFields[] = changedFields(previousState, state);

    // If nothing has changed
    if (changed.length === 0) {
        return null;
    } else {
        // Some fields have changed

        // Insert new state into db
        const currentState = await State.create({
            ...state,
        });

        const change = await Change.create({
            website: this._id,
            currentState: currentState._id,
            previousState: previousState._id,
            fields: changed,
        });

        return change;
    }

    return null;
});
// ===================================================================================================
// Create model from schema
const Website = mongoose.model<IWebsite, WebsiteModel>('Website', websiteSchema);
// ===================================================================================================

export default Website;