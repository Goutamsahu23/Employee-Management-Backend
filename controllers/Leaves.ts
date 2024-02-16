import { Request, Response } from "express";
import User from '../model/User';
import Leave from "../model/leaves";


export const userLeaves = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { startDate, endDate, reason } = req.body;

        // Ensure startDate and endDate are properly parsed as Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Check if startDate and endDate are valid Date objects
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: 'Invalid start date or end date' });
        }

        // Calculate the number of days for the leave period
        const leaveDays = Math.ceil((parsedEndDate.getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24));


        const user = await User.findById(currentUser.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        if (user.totalLeavesPerMonth - user.leavesTaken < leaveDays) {
            return res.status(400).json({ error: 'Not enough leaves available' });
        }

        const newLeave = await Leave.create({
            userId: currentUser.id,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            reason,
        });

        user.leavesTaken += leaveDays;
        await user.save();

        res.status(201).json({ 
            message: 'Leave added successfully!' ,
            data:newLeave
        });
    } catch (err) {
        console.error('Error during leave creation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const leaveHistory=async(req:Request, res:Response)=>{
    try{
        const currentUser=req.user;

        const leaveHistory=await Leave.find({
            userId:currentUser.id
        }).populate({
            path: 'userId',
            select: 'firstName lastName email'
        });


        res.status(200).json({
            leaveHistory
        });
    }catch(err){
        console.error('Error retrieving leave history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Approve leave controller
export const approveLeave = async (req: Request, res: Response) => {
    try {
        const { leaveId } = req.params;

        // Update leave status to 'approved'
        await Leave.findByIdAndUpdate(leaveId, { status: 'Approved' });

        res.status(200).json({ message: 'Leave approved successfully.' });
    } catch (error) {
        console.error('Error approving leave:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Reject leave controller
export const rejectLeave = async (req: Request, res: Response) => {
    try {
        const { leaveId } = req.params;

        // Find the leave to be rejected
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }

        // Update leave status to 'rejected'
        await Leave.findByIdAndUpdate(leaveId, { status: 'Rejected' });

        // If leave is rejected, do not update leavesTaken
        if (leave.status !== 'rejected') {
            // Update user's leavesTaken count only if the leave was not rejected
            const user = await User.findById(leave.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Calculate leave duration
            const leaveDuration = Math.ceil((leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24));

            // Deduct leave duration from user's leavesTaken
            user.leavesTaken -= leaveDuration;
            await user.save();
        }

        res.status(200).json({ message: 'Leave rejected successfully.' });
    } catch (error) {
        console.error('Error rejecting leave:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const allLeaves=async(req:Request, res:Response)=>{
    try{


        const allLeaves=await Leave.find({}).populate(
            {
            path: 'userId',
            select: 'firstName lastName email'
        });


        res.status(200).json({
            allLeaves
        });
    }catch(err){
        console.error('Error retrieving leave history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


