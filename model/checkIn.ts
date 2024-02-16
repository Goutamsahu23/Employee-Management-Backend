import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckIn extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    timestamp: Date;
}

const checkInSchema = new Schema<ICheckIn>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model<ICheckIn>('CheckIn', checkInSchema);
