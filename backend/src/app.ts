import 'dotenv/config';
import express, { Request, Response, json } from 'express';
import connect from './utils/connect.util';
import log from './utils/logger.util';
import Website from './models/website.model';
import changeEmitter, { EEvents } from './events/change_emitter';
import { IChange } from './models/change.model';
import EmailNotifier from './notifiers/email_notifier';

// ================================================================================================================

const port = process.env.PORT || 3000;

const app = express();

app.use(json());

// ================================================================================================================

const emailNotifier = new EmailNotifier();

changeEmitter.on(EEvents.CHANGE, async (change: IChange) => {
    await emailNotifier.send(change);
});

// ================================================================================================================

app.get('/check', async (req: Request, res: Response) => {
    const url = 'http://www.google.com/';
    let website = await Website.findOne({
        address: url,
    });
    if (!website) {
        website = await Website.create({
            address: url,
        });
    }

    // ------------------------------------------------------
    const change = await website.getChange();
    // ------------------------------------------------------



    return res.status(200).send(change);
});

// ================================================================================================================

app.listen(port, async () => {
    // Connect to database
    await connect();

    log.info(`App Running on port ${port}!`);
});