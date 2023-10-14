import dayjs from 'dayjs';
import { IChange } from '../models/change.model';
import State from '../models/state.model';
import Website from '../models/website.model';
import Notifier from './notifier';
import log from '../utils/logger.util';

export default class EmailNotifier implements Notifier<IChange> {
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

        log.info(message);
    }
}