import mongoose,{Schema,model,Document} from "mongoose";

export interface IEmployeeLeave extends Document{
    userId: mongoose.Schema.Types.ObjectId;
    reason:string,
    startDate:Date,
    endDate:Date,
    status: string; 
    createdAt: Date;
    updatedAt: Date;
}

const leaveSchema=new Schema<IEmployeeLeave>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
        },

        reason:{
            type:String,
            required:true
        },
        startDate:{
            type:Date,
            required:true
        },
        endDate:{
            type:Date,
            required:true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'], 
            default: 'Pending'
        },
        createdAt:{
            type:Date,
            default:Date.now(),
        },
        updatedAt:{
            type:Date,
            default:Date.now(),
        },
        
    }
)

export default model<IEmployeeLeave>('Leave',leaveSchema)