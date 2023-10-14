import { Request, Response, Router } from 'express';
import Website from '../models/website.model';
import { requireUser } from '../middleware/requireUser';

export const websiteRouter = Router();

websiteRouter.get('/', async (req: Request, res: Response) => {
    try {
        const websites = await Website.find().lean();
        return res.send(websites);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});


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


type TBody = {
    address: string,
}

websiteRouter.post('/', requireUser, async (req: Request<{}, {}, TBody>, res: Response) => {
    try {
        if (!req.body.address) {
            throw new Error('Must provide an address!');
        }

        const website = await Website.create({
            address: req.body.address,
        });

        return res.send(website);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});