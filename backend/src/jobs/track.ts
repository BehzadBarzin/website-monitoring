import cron, { ScheduledTask } from 'node-cron';
import log from '../utils/logger.util';
import Website from '../models/website.model';

export default class Track {

    private expression: string = process.env.SCAN_CRON_EXPRESSION || '*/10 * * * *'; // every 10 minute
    private task: ScheduledTask | undefined;

    public start(): void {
        this.task = cron.schedule(this.expression, async () =>  {
            // Get a list of websites from database
            const websites = await Website.find();

            for (let w of websites) {
                await w.getChange();
            }
        });
    }

    public stop(): void {
        if (this.task) {
            this.task.stop();
        }
    }
}