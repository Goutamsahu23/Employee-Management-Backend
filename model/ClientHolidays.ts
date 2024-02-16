import mongoose, {Schema,model,Document} from "mongoose";

export interface IClientHoliday extends Document{
    event:string,
    Date:Date,
}

const clientHolidaySchema=new Schema<IClientHoliday>(
    {
        event:{
            type:String,

        },
        Date:{
            type:Date,
        }
    }
)

export default model<IClientHoliday>('ClientHoliday',clientHolidaySchema)