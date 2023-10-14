import jwt from 'jsonwebtoken';

// =======================================================================================================
// Keys
const privateKey = process.env.privateKey || '';
const publicKey = process.env.publicKey || '';
// =======================================================================================================
/**
 * Sign the JWT with a private key
 */
export function signJWT(payload: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, privateKey, {
        ...(options && options), // Spread options argument, if it is defined
        algorithm: 'RS256',
    });
}

// =======================================================================================================
/**
 * verify the JWT with a public key
 */
export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey);
        return { 
            valid: true, 
            expired: false,
            decoded: decoded,
        };
    } catch (error: any) {
        // If not verified, return an object
        return { 
            valid: false, 
            expired: error.message = 'jwt expired', // If error message is set to 'jwt expired' set 'expired' to true
            decoded: null,
        };
    }
}
// =======================================================================================================
