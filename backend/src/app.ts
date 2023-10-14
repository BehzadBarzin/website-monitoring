import 'dotenv/config';
import express, { Request, Response, json } from 'express';
import connect from './utils/connect.util';
import log from './utils/logger.util';
import Website from './models/website.model';
import changeEmitter, { EEvents } from './events/change_emitter';
import { IChange } from './models/change.model';
import EmailNotifier from './notifiers/email_notifier';
import SMSNotifier from './notifiers/sms_notifier';
import Track from './jobs/track';
import { addWebsites } from './utils/helpers.util';
import { changeRouter } from './routers/change.router';
import { stateRouter } from './routers/state.router';
import { websiteRouter } from './routers/website.router';
import { userRouter } from './routers/user.router';
import { sessionRouter } from './routers/session.router';
import { deserializeUser } from './middleware/deserializeUser';
import cors from 'cors';
import { watchListRouter } from './routers/watchlist.router';

// ================================================================================================================

const port = process.env.PORT || 3000;

const app = express();

app.use(json());

app.use(cors({
    origin: '*',
}));
// ================================================================================================================

const emailNotifier = new EmailNotifier();
const smsNotifier = new SMSNotifier();

changeEmitter.on(EEvents.CHANGE, async (change: IChange) => {
    await emailNotifier.send(change);
    await smsNotifier.send(change);
});

// ================================================================================================================
// Job to keep track of website changes
const track = new Track();
track.start();

// ================================================================================================================

app.get('/check', (req: Request, res: Response) => {
    return res.status(200).send('OK!');
});

// ================================================================================================================
// Call our custom middleware on every route
app.use(deserializeUser);
// ================================================================================================================

app.use('/websites', websiteRouter);

app.use('/states', stateRouter);

app.use('/changes', changeRouter);

app.use('/users', userRouter);

app.use('/sessions', sessionRouter);

app.use('/watch-lists', watchListRouter);

// ================================================================================================================

app.listen(port, async () => {
    // Connect to database
    await connect();

    await addWebsites();

    log.info(`App Running on port ${port}!`);
});