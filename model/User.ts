import mongoose, { Schema,model,Document } from "mongoose";

export interface IUser extends Document{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    token:string,
    checkInTime:mongoose.Schema.Types.ObjectId,
    checkOutTime:mongoose.Schema.Types.ObjectId,
    // averageWorkingHoursPerDay: number;
    leavesTaken:number,
    totalLeavesPerMonth:number,
    createdAt:Date,
    updatedAt:Date,
}


const userSchema=new Schema<IUser>(
    {
        firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
            unique: true
		},

		password: {
			type: String,
			required: true,
		},
        token: {
			type: String,
		},

        checkInTime:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'CheckIn'
        },

        checkOutTime:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'CheckOut'
        },
        // averageWorkingHoursPerDay: {
        //     type: Number,
        //     default: 0 ,
        // },
        leavesTaken:{
            type:Number,
            default:0,
        },
        totalLeavesPerMonth:{
            type:Number,
            default:5,
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

export default model<IUser>('User',userSchema)