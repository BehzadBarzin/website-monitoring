import { Request, Response, Router } from 'express';
import State from '../models/state.model';

export const stateRouter = Router();

stateRouter.get('/:website', async (req: Request<{website: string}>, res: Response) => {
    try {
        const states = await State.find({
            website: req.params.website,
        }).lean();
        return res.send(states);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});