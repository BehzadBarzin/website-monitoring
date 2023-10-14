import mongoose, { Schema, Document, Model } from 'mongoose';

// ===================================================================================================
// Create a TypeScript type for the model

export interface IWatchList extends Document {
    user: Schema.Types.ObjectId,
    websites: Schema.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date,
}

// Create a new Model type with the basic interfaces defined above:
type WatchListModel = Model<IWatchList, {}, {}>;
// ===================================================================================================
// Schema (MongoDB)
const watchListSchema = new Schema<IWatchList, WatchListModel, {}>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    websites: {
        type: [Schema.Types.ObjectId],
        ref: 'Website',
    },
}, {
    timestamps: true,
});

// ===================================================================================================
// Create model from schema
const WatchList = mongoose.model<IWatchList, WatchListModel>('WatchList', watchListSchema);
// ===================================================================================================

export default WatchList;