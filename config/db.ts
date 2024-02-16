import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const DB_URL=process.env.DB_URL;

if (!DB_URL) {
    console.error("DB_URL is not provided in the environment variables.");
    process.exit(1);
}


const dbConnect=async()=>{
    try{
        await mongoose.connect(DB_URL);
        console.log('db connected');
    }catch(err){
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
}


export default dbConnect;