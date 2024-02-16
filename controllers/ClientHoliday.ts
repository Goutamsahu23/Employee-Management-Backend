import { Request,Response } from "express";
import ClientHolidays from "../model/ClientHolidays";

export const clientHoliday=async(req:Request,res:Response)=>{
    try{
        const { event,date}=req.body;

        const newClientHoliday=await ClientHolidays.create(
            {
                event,
                date,
            }
        )

        res.status(200).json({
            newClientHoliday
        });


    }catch(err){
        console.error( err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllClientHoliday=async(req:Request,res:Response)=>{
    try{
        const Holidays=await ClientHolidays.find({});


        res.status(200).json({
            Holidays
        });

    }catch(err){

    }
}