import { Request, Response, Router } from 'express';
import Website from '../models/website.model';
import User, { IUser } from '../models/user.model';
import WatchList from '../models/watchlist.model';
import { requireUser } from '../middleware/requireUser';
import log from '../utils/logger.util';

export const watchListRouter = Router();

// get the watch list of a user
watchListRouter.get('/', requireUser, async (req: Request, res: Response) => {
    try {
        
        const user = await User.findById(res.locals.user._doc._id);
        if (!user) {
            throw new Error('No such user!');
        }

        let watchList = await WatchList.findOne({
            user: user.id,
        });

        if (!watchList) {
            watchList = await WatchList.create({
                user: user.id,
            });
        }

        return res.send(watchList);
    } catch (error: any) {
        res.send(error.message);
    }

});

// delete the entire watch list of a user
watchListRouter.delete('/', requireUser, async (req: Request, res: Response) => {
    try {
        
        const user = await User.findById(res.locals.user._doc._id);
        if (!user) {
            throw new Error('No such user!');
        }

        let watchList = await WatchList.deleteOne({
            user: user.id,
        });

        return res.send(watchList);
    } catch (error: any) {
        res.send(error.message);
    }

});


type TBody = {
    website: string,
}

// Add a single website to watch list
watchListRouter.post('/', requireUser, async (req: Request<{}, {}, TBody>, res: Response) => {
    try {
        const user = await User.findById(res.locals.user._doc._id);

        if (!user) {
            throw new Error('No such user!');
        }

        const website = await Website.findById(req.body.website);
        if (!website) {
            throw new Error('No such website!');
        }

        let watchList = await WatchList.findOne({
            user: user.id,
        });

        if (!watchList) {
            watchList = await WatchList.create({
                user: user.id,
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

// Delete a single website from watch list
watchListRouter.delete('/:id', requireUser, async (req: Request<{id: string}, {}, {}>, res: Response) => {
    try {
        const user = await User.findById(res.locals.user._doc._id);
        if (!user) {
            throw new Error('No such user!');
        }

        const website = await Website.findById(req.params.id);
        if (!website) {
            throw new Error('No such website!');
        }

        let watchList = await WatchList.findOne({
            user: user.id,
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

