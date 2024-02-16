import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckOut extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    timestamp: Date;
}

const checkOutSchema = new Schema<ICheckOut>(
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

export default mongoose.model<ICheckOut>('CheckOut', checkOutSchema);
