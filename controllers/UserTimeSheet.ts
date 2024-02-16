import { Request, Response } from 'express';
import User, { IUser } from '../model/User';
import CheckIn, { ICheckIn } from '../model/checkIn';
import CheckOut, { ICheckOut } from '../model/checkOut';
import Leave, { IEmployeeLeave } from '../model/leaves';
import moment from 'moment';

export const generateTimesheet = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId: string = req.user.id;

        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const checkIns: ICheckIn[] = await CheckIn.find({ userId: userId });
        const checkOuts: ICheckOut[] = await CheckOut.find({ userId: userId });

        // Fetch leaves for the user that include today's date
        const leavesToday: IEmployeeLeave[] = await Leave.find({
            userId: userId,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        // Check if the user is on leave for today
        const isOnLeaveToday = leavesToday.length > 0;

        if (!isOnLeaveToday) {
            if (checkIns.length !== checkOuts.length) {
                return res.status(400).json({ message: 'Mismatch in check-ins and check-outs' });
            }
        }

        // Fetch leaves for the user
        const leaves: IEmployeeLeave[] = await Leave.find({
            userId: userId,
            startDate: { $lte: new Date() }, // Leaves that started on or before today
            endDate: { $gte: new Date() } // Leaves that end on or after today
        });

        const leaveReason = leaves.length > 0 ? leaves[0].reason : 'NULL';

        let timesheetArray;

        if (checkIns.length === 0 && checkOuts.length === 0) {
            // User didn't check in and check out
            timesheetArray = [{
                checkIn: 'absent',
                checkout: 'absent',
                status: 'absent',
                workingHours: '',
                leaveReason: leaveReason
            }];
        } else {
            timesheetArray = checkIns.map((checkIn, index) => {
                const checkOut = checkOuts[index];

                if (!checkOut) {
                    return {
                        checkIn: checkIn.timestamp ? checkIn.timestamp.toISOString() : '',
                        checkout: '',
                        status: 'present',
                        workingHours: '',
                        leaveReason: leaveReason
                    };
                }

                const checkInTime = checkIn.timestamp ? checkIn.timestamp.toISOString() : '';
                const checkOutTime = checkOut.timestamp ? checkOut.timestamp.toISOString() : '';

                const status = checkIn && checkOut ? 'present' : 'absent';

                const diffMilliseconds = checkOut.timestamp.getTime() - checkIn.timestamp.getTime();
                const diffHours = diffMilliseconds / (1000 * 60 * 60);

                return {
                    checkIn: checkInTime,
                    checkout: checkOutTime,
                    status: status,
                    workingHours: diffHours.toFixed(2),
                    leaveReason: status === 'absent' ? leaveReason : 'NULL'
                };
            });
        }

        return res.status(200).json({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            timesheetArray
        });
    } catch (error) {
        console.error('Error generating timesheet:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




export const generateTimesheetByDate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId: string = req.user.id;
        const { month, year } = req.body;

        // Validate month and year
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Construct start and end dates for the month
        const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').startOf('month').toDate();
        const endDate = moment(startDate).endOf('month').toDate();

        if (startDate > new Date()) {
            return res.status(400).json({ message: 'Selected month is in the future' });
        }

        // Fetch user details
        const user: IUser | null = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch check-ins for the month
        const checkIns: ICheckIn[] = await CheckIn.find({
            userId: userId,
            timestamp: { $gte: startDate, $lte: endDate }
        });

        // Fetch check-outs for the month
        const checkOuts: ICheckOut[] = await CheckOut.find({
            userId: userId,
            timestamp: { $gte: startDate, $lte: endDate }
        });

        // Fetch leaves for the month
        const leaves: IEmployeeLeave[] = await Leave.find({
            userId: userId,
            startDate: { $gte: startDate, $lte: endDate }
        });

        // Construct timesheet array
        const leaveReason = leaves.length > 0 ? leaves[0].reason : 'NULL';

        let timesheetArray;

        if (checkIns.length === 0 && checkOuts.length === 0) {
            // User didn't check in and check out
            timesheetArray = [{
                checkIn: 'absent',
                checkout: 'absent',
                status: 'absent',
                workingHours: '',
                leaveReason: leaveReason,
                

            }];
        } else {
            timesheetArray = checkIns.map((checkIn, index) => {
                const checkOut = checkOuts[index];

                if (!checkOut) {
                    return {
                        checkIn: checkIn.timestamp ? checkIn.timestamp.toISOString() : '',
                        checkout: '',
                        status: 'present',
                        workingHours: '',
                        leaveReason: leaveReason
                    };
                }

                const checkInTime = checkIn.timestamp ? checkIn.timestamp.toISOString() : '';
                const checkOutTime = checkOut.timestamp ? checkOut.timestamp.toISOString() : '';

                const status = checkIn && checkOut ? 'present' : 'absent';

                const diffMilliseconds = checkOut.timestamp.getTime() - checkIn.timestamp.getTime();
                const diffHours = diffMilliseconds / (1000 * 60 * 60);

                return {
                    checkIn: checkInTime,
                    checkout: checkOutTime,
                    status: status,
                    workingHours: diffHours.toFixed(2),
                    leaveReason: status === 'absent' ? leaveReason : 'NULL'
                };
            });
        }

        return res.status(200).json({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            timesheetArray,
        });
    } catch (error) {
        console.error('Error generating timesheet:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};












































































// const timesheetArray = [
//     {
//         name: `${user.firstName} ${user.lastName}`,
//         email:  `${user.email}`,
//         checkIn: "2024-02-14:09:20:45",
//         checkout: "2024-02-14:18:45:23",
//         status: "present",
//         workingHours: "7.32",
//         leaveReason: "NULL"
//     },
//     {
//         name: "First name  + Last name",
//         email: "fits@gmail.com",
//         checkIn: "2024-02-14:09:20:45",
//         checkout: "2024-02-14:18:45:23",
//         status: "present",
//         workingHours: "7.32",
//         leaveReason: "NULL"
//     },
//     {
//         name: "First name  + Last name",
//         email: "fits@gmail.com",
//         checkIn: "2024-02-14:09:20:45",
//         checkout: "2024-02-14:18:45:23",
//         status: "present",
//         workingHours: "7.32",
//         leaveReason: "NULL"
//     },
//     {
//         name: "First name  + Last name",
//         email: "fits@gmail.com",
//         checkIn: "2024-02-14:09:20:45",
//         checkout: "2024-02-14:18:45:23",
//         status: "present",
//         workingHours: "7.32",
//         leaveReason: "NULL"
//     },
// ]

// const responseObj = {
//     timesheetArray,
//     averageWorkingHoursPerDay
// }
