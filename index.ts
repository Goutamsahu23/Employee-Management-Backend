import express,{Express,Request,Response} from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import dbConnect from './config/db'
import userRoutes from './routes/userRoutes'

dotenv.config();



const app:Express=express();
const PORT=process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser());

app.get('/',(req:Request,res:Response)=>{
    res.send("Express + TypeScript");
})
app.use('/api/v1/auth',userRoutes);

dbConnect();

app.listen(PORT,()=>{
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
})