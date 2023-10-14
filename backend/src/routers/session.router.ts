import { Request, Response, Router } from 'express';
import { createUser, validatePassword } from '../services/user.service';
import { omit } from 'lodash';
import { createSession, issueAccessToken, updateSession } from '../services/session.service';
import { signJWT } from '../utils/jwt.utils';
import { requireUser } from '../middleware/requireUser';

export const sessionRouter = Router();

type TBody = {
    email: string,
    password: string,
}

sessionRouter.post('/', async (req: Request<{}, {}, TBody>, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error('Incomplete Body!');
        }

        // Validate the user's password
        const user = await validatePassword(req.body.email, req.body.password);
        
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Create session
        const { accessToken, refreshToken } = await issueAccessToken(user, req.get('user-agent'));

        // return access and refresh tokens
        return res.send({
            user: omit(user.toJSON(), 'password'),
            accessToken,
            refreshToken,
        });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// ============================================================================================================
// Private routes

sessionRouter.delete('/', requireUser, async (req: Request, res: Response) => {
    try {
        // The user object was decoded from JWT and attached to res.locals within the deserializeUser middleware
        const session = res.locals.user.session;

        await updateSession({
            _id: session,
        }, {
            valid: false,
        });

        res.send({
            accessToken: null,
            refreshToken: null,
        });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});