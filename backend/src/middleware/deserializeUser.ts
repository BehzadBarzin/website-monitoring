import { get } from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/jwt.utils';
import { reIssueAccessToken } from '../services/session.service';
import log from '../utils/logger.util';
import User, { IUser } from '../models/user.model';


/**
 * Find the user with the access token passed to request, and add the user object to request for ease-of-use
 */
export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    // Using lodash's get method for safer access to a property that might not exist
    let accessToken = get(req, 'headers.authorization', '');
    // Remove 'Bearer ' from the start of the access token
    accessToken = accessToken.replace(/^Bearer\s/, '');


    // Using lodash's get method for safer access to a property that might not exist
    let refreshToken = get(req, 'headers.x-refresh', '').toString();

    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = verifyJWT(accessToken);

    if (decoded) {
        // Attach the user (that was encoded in JWT) to the response
        res.locals.user = decoded;
    }

    // If user's token has expired and they have a refresh token
    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken(refreshToken);
        
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);
            
            // Set the user to res.locals to be accessible by handlers
            const result = verifyJWT(newAccessToken);
            res.locals.user = result.decoded;
        } 

    }

    return next();
}