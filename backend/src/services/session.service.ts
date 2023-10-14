import { FilterQuery, UpdateQuery } from "mongoose";
import Session, { ISession } from "../models/session.model";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { get } from "lodash";
import { findUser } from "./user.service";
import { IUser } from "../models/user.model";

export async function createSession(userId: string, userAgent: string) {

    try {
        return await Session.create({
            user: userId,
            userAgent: userAgent,
        });
    } catch (error) {
        // Rethrow error to be caught by session.controller.ts
        throw error;
    }
    
}

// ====================================================================================

export async function findSessions(query: FilterQuery<ISession>) {
    
    try {
        return await Session.find(query).lean(); // '.lean()' will only return the object with its fields (no functions)
    } catch (error) {
        // Rethrow error to be caught by session.controller.ts
        throw error;
    }
    
}

// ====================================================================================

export async function updateSession(query: FilterQuery<ISession>, update: UpdateQuery<ISession>) {
    return await Session.updateOne(query, update);
}

// ====================================================================================

export async function issueAccessToken(user: IUser, userAgent: string = '') {
    
    // Create session
    const session = await createSession(user._id, userAgent);

    const accessTokenTimeToLive = process.env.accessTokenTimeToLive || '15m';
    // Create an access token
    const accessToken = signJWT({
        ...user,
        session: session._id,
    }, {
        expiresIn: accessTokenTimeToLive,
    });

    const refreshTokenTimeToLive = process.env.refreshTokenTimeToLive || '1y';
    // Create a refresh token
    const refreshToken = signJWT({
        ...user,
        session: session._id,
    }, {
        expiresIn: refreshTokenTimeToLive,
    });

    return {
        accessToken,
        refreshToken,
    };
}


// ====================================================================================

// Re-issue expired access token with refresh token
export async function reIssueAccessToken(refreshToken: string) {
    const { decoded } = verifyJWT(refreshToken);

    const sessionId = get(decoded, 'session');

    // To make sure that the session is still valid when issuing a new access token
    if (!decoded || !sessionId) {
        return false;
    }

    const session = await Session.findById(sessionId);

    if (!session || !session.valid) {
        return false;
    }

    const user = await findUser({
        _id: session.user,
    });

    if (!user) {
        return false;
    }

    const refreshTokenTimeToLive = process.env.refreshTokenTimeToLive || '15m';

    // Create an access token
    const accessToken = signJWT({
        ...user,
       session: session._id,
    }, {
       expiresIn: refreshTokenTimeToLive,
    });
    

    return accessToken;
}
