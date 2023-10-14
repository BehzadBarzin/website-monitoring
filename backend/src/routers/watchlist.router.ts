import { Request, Response, Router } from 'express';
import Website from '../models/website.model';
import User from '../models/user.model';
import WatchList from '../models/watchlist.model';
import { requireUser } from '../middleware/requireUser';

export const watchListRouter = Router();

watchListRouter.get('/', requireUser, async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        if (!user) {
            throw new Error('No such user!');
        }

        let watchList = await WatchList.findOne({
            user: user._id,
        });

        if (!watchList) {
            throw new Error('This user doesn\'t have a watch list');
        }

        return res.send(watchList);
    } catch (error: any) {
        res.status(500).send(error.message);
    }

});


type TBody = {
    website: string,
}

watchListRouter.post('/', requireUser, async (req: Request<{}, {}, TBody>, res: Response) => {
    try {
        const user = res.locals.user;

        if (!user) {
            throw new Error('No such user!');
        }

        const website = await Website.findById(req.body.website);
        if (!website) {
            throw new Error('No such website!');
        }

        let watchList = await WatchList.findOne({
            user: user._id,
        });

        if (!watchList) {
            watchList = await WatchList.create({
                user: user._id,
                websites: [],
            });
        }

        watchList.websites.push(website._id);

        await watchList.save();

        return res.send(watchList);

    } catch (error: any) {
        res.status(500).send(error.message);
    }

});

watchListRouter.delete('/:id', requireUser, async (req: Request<{id: string}, {}, {}>, res: Response) => {
    try {
        const user = res.locals.user;
        if (!user) {
            throw new Error('No such user!');
        }

        const website = await Website.findById(req.params.id);
        if (!website) {
            throw new Error('No such website!');
        }

        let watchList = await WatchList.findOne({
            user: user._id,
        });

        if (!watchList) {
            throw new Error('This user doesn\'t have a watch list');
        }

        watchList.websites = watchList.websites.filter(w => w !== website._id );

        await watchList.save();

        return res.send(watchList);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

