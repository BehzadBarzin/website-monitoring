import { AnyKeys, FilterQuery } from 'mongoose';
import User, { IUser } from '../models/user.model';
import { omit } from 'lodash';

// ======================================================================================================
// Create a user in database
export async function createUser(input: IUser | AnyKeys<IUser>) {
    try {
        return await User.create(input);
    } catch (error) {
        // Rethrow error to be caught by user.controller.ts
        throw error;
    }
}
// ======================================================================================================
/**
 * Check user's password.
 * 
 * @param email user's email
 * @param password candidate password
 * @returns false if the password is incorrect, and the User object if the password is correct
 */
export async function validatePassword(email: string, password: string) {
    const user = await User.findOne({
        email: email,
    });

    if (!user) {
        return false;
    }

    const isValid = await user.comparePasswords(password);

    if (!isValid) {
        return false;
    }

    return user;
}

// ======================================================================================================

export async function findUser(query: FilterQuery<IUser>) {
    return await User.findOne(query).lean(); // Using lean to only return property values
}