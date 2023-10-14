import dayjs from 'dayjs';
import { IChange } from '../models/change.model';
import State from '../models/state.model';
import Website, { IWebsite } from '../models/website.model';
import Notifier from './notifier';
import log from '../utils/logger.util';

export default class SMSNotifier implements Notifier<IChange> {

    private async getReceivers(website: IWebsite): Promise<string[]> {
        // Check the database for users watching a 'website'
        // ...

        // For now, we return a list of fake phone numbers
        return [
            '+12345678900',
            '+12345678901',
            '+12345678902',
        ];
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

        log.info('----------------------------------');
        log.info(`Sending SMS To: ${receivers}`);
        log.info(message);
        log.info('----------------------------------');
    }
}