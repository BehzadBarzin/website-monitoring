import dayjs from 'dayjs';
import { IChange } from '../models/change.model';
import State from '../models/state.model';
import Website, { IWebsite } from '../models/website.model';
import Notifier from './notifier';
import log from '../utils/logger.util';

const sgMail = require('@sendgrid/mail');
import WatchList from '../models/watchlist.model';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const fromEmail = process.env.FROM_EMAIL || '';


export default class EmailNotifier implements Notifier<IChange> {

    private async getReceivers(website: IWebsite): Promise<string[]> {
        // Check the database for users watching a 'website'
        const watchLists = await WatchList.find({
            websites: {
                '$in': [website._id]
            }
        }).populate('user');

        // @ts-ignore
        const receivers: string[] = watchLists.map((w) => w.user.email)

        return receivers;
    }

    public async send(data: IChange): Promise<void> {

        const currentState = await State.findById(data.currentState);
        if (!currentState) return;
        
        const website = await Website.findById(currentState.website);
        if (!website) return;

        let message = `
        New Change:
        Website: ${website.address}
        Date: ${dayjs(data.createdAt).format('DD/MM/YYYY - HH:mm')}
        Changes: ${data.fields}
        `;

        const receivers = await this.getReceivers(website);
        
        // log.info('----------------------------------');
        // log.info(`Sending Email To: ${receivers}`)
        // log.info(message);
        // log.info('----------------------------------');

        receivers.forEach(async (rec) => {
            const msg = {
                to: rec,
                from: fromEmail,
                subject: `New Change: ${website.address}`,
                text: message,
                html: message,
            };

            try {
                console.log(msg);
                await sgMail.send(msg);
            } catch (error) {
                
            }
        });
    }
}