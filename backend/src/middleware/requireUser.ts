import { NextFunction, Request, Response } from 'express';

/**
 * Where this middleware is used, the user must exist on the res.locals object, which is done by deserializeUser middleware.
 */
export function requireUser(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    if (!user) {
        res.sendStatus(403);
    }

    return next();
}