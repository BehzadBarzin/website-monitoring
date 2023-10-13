import mongoose from 'mongoose';
import log from './logger.util';

async function connect() {
    try {
        const dbUri = process.env.MONGO_URI || '';

        if (!dbUri) {
            throw new Error('MongoDB URI is not set.');
        }

        await mongoose.connect(dbUri);    
        log.info('Connected to Database.');
    } catch (error) {
        log.error('Couldn\'t connect to Database.');
        process.exit(1);
    }
}


export default connect;