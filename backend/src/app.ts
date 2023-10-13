import 'dotenv/config';
import express, { Request, Response, json } from 'express';
import connect from './utils/connect.util';
import log from './utils/logger.util';

const port = process.env.PORT || 3000;

const app = express();

app.use(json());

app.get('/check', (req: Request, res: Response) => {
    return res.status(200).send('Hello!');
});

app.listen(port, async () => {
    // Connect to database
    await connect();

    log.info(`App Running on port ${port}!`);
});