import { Request, Response, Router } from 'express';
import { createUser } from '../services/user.service';
import { omit } from 'lodash';
import { signJWT } from '../utils/jwt.utils';
import { createSession, issueAccessToken } from '../services/session.service';

export const userRouter = Router();

type TBody = {
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
}

userRouter.post('/', async (req: Request<{}, {}, TBody>, res: Response) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordConfirmation) {
            throw new Error('Incomplete Body!');
        }

        const user = await createUser(req.body);
        
        const { accessToken, refreshToken } = await issueAccessToken(user, req.get('user-agent'));

        // Send back user without password
        return res.send({
            user: omit(user.toJSON(), 'password'),
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});