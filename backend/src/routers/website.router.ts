import { Request, Response, Router } from 'express';
import Website from '../models/website.model';

export const websiteRouter = Router();

websiteRouter.get('/:id', async (req: Request<{id: string}>, res: Response) => {
    try {
        const website = await Website.findOne({
            _id: req.params.id,
        }).lean();
        return res.send(website);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});