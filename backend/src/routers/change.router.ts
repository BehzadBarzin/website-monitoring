import { Request, Response, Router } from 'express';
import Change from '../models/change.model';

export const changeRouter = Router();

changeRouter.get('/:website', async (req: Request<{website: string}>, res: Response) => {
    try {
        const changes = await Change.find({
            website: req.params.website,
        }).populate(['previousState', 'currentState', 'website']).sort({
            createdAt: 'desc',
        }).lean();
        return res.send(changes);
    } catch (error: any) {
        res.send(error.message);
    }
});