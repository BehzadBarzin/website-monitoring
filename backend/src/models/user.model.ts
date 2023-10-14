import mongoose, { Schema, Document, CallbackWithoutResultAndOptionalError, SaveOptions, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// ===================================================================================================
// Create a TypeScript type for the User model

export interface IUser extends Document {
    email: string,
    name: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
}

// Put all user instance methods in this interface:
interface IUserMethods {
    comparePasswords(candidatePassword: string): Promise<boolean>;
}

// Create a new Model type with the basic interfaces defined above:
type UserModel = Model<IUser, {}, IUserMethods>;

// ===================================================================================================
// User Schema (MongoDB)
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

// ===================================================================================================
// Hash the password before saving to database

userSchema.pre<IUser>('save', {document: true}, async function(this: IUser, next: CallbackWithoutResultAndOptionalError, options: SaveOptions) {
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt
    const saltWorkFactor = Number(process.env.saltWorkFactor) || 10;
    const salt = await bcrypt.genSalt(saltWorkFactor);
    // Hash raw password
    const hash = await bcrypt.hash(this.password, salt);
    // Replace raw passwords with hashed password
    this.password = hash;
    
    return next();
});
// ===================================================================================================
// Add utility method to model to easily compare password with hashed password from db
userSchema.method<IUser>('comparePasswords', async function(this: IUser, candidatePassword: string) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
});
// ===================================================================================================
// Create model from schema
const User = mongoose.model<IUser, UserModel>('User', userSchema);
// ===================================================================================================

export default User;