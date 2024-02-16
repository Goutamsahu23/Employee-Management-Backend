import { Request, Response } from "express";
import CheckIn from "../model/checkIn";
import CheckOut from "../model/checkOut";
import User from '../model/User';

export const checkInUser = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        console.log(currentUser);

        const newCheckIn = await CheckIn.create({
            userId: currentUser.id,
        });

        await User.findByIdAndUpdate(
            currentUser.id,
            { checkInTime: newCheckIn._id },
            { new: true });


        res.status(201).json({ message: 'User checked in successfully' });
    } catch (err) {
        console.error('Error during check-in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const checkOutUser = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;

        const user = await User.findById(currentUser.id);

        if (!user || !user.checkInTime) {
            return res.status(400).json({ error: 'User has not checked in' });
        }

        const newCheckOut = await CheckOut.create({
            userId: currentUser.id,
        });

        await User.findByIdAndUpdate(
            currentUser.id,
            { checkOutTime: newCheckOut._id },
            { new: true });

        res.status(201).json({ message: 'User checked out successfully' });
    } catch (err) {
        console.error('Error during check-out:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// export const calculateAverageWorkingHoursPerDay = async (req: Request, res: Response) => {
//     try {
//         const userId = req.params.userId; // Assuming userId is passed as a parameter in the request

//         // Retrieve the user's check-in and check-out records
//         const checkIns = await CheckIn.find({ userId });
//         const checkOuts = await CheckOut.find({ userId });

//         // Calculate working hours for each day
//         const workingHoursPerDay: number[] = [];
//         checkIns.forEach(checkIn => {
//             const correspondingCheckOut = checkOuts.find(checkOut => checkOut.timestamp > checkIn.timestamp);
//             if (correspondingCheckOut) {
//                 const workingHours = (correspondingCheckOut.timestamp.getTime() - checkIn.timestamp.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
//                 workingHoursPerDay.push(workingHours);
//             }
//         });

//         // Calculate average working hours per day
//         let averageWorkingHoursPerDay = 10;
//         if (workingHoursPerDay.length > 0) {
//             const totalWorkingHours = workingHoursPerDay.reduce((acc, curr) => acc + curr, 0);
//             averageWorkingHoursPerDay = totalWorkingHours / workingHoursPerDay.length;
//         }

//         // Update the user document with the average working hours per day
//         await User.findByIdAndUpdate(userId, { averageWorkingHoursPerDay });

//         res.status(200).json(
//             { averageWorkingHoursPerDay }
//             );

//     } catch (err) {
//         console.error('Error calculating average working hours per day:', err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



