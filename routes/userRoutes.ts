import  express  from "express";
const router=express.Router();
import { login, signup } from "../controllers/Auth";
import {  checkInUser,checkOutUser } from "../controllers/UserActivity";
import { auth, isAdmin } from "../middleware/auth";
import { allLeaves, approveLeave, leaveHistory, rejectLeave, userLeaves } from "../controllers/Leaves";
import { clientHoliday, getAllClientHoliday } from "../controllers/ClientHoliday";
import { generateTimesheet, generateTimesheetByDate } from "../controllers/UserTimeSheet";


router.post('/signup',signup);
router.post('/login',login);
router.post('/checkIn',auth,checkInUser);
router.post('/checkOut',auth,checkOutUser);
// router.post('/wordkPerDay/:id',auth,calculateAverageWorkingHoursPerDay);
router.post('/apply-leaves',auth,userLeaves);
router.get('/leaveHistory',auth,leaveHistory);

router.put('/approve-leave/:leaveId',auth, isAdmin, approveLeave);


router.put('/reject-leave/:leaveId',auth, isAdmin, rejectLeave);
router.get('/allLeaves',auth,isAdmin,allLeaves);

router.post('/newClienHoliday',auth,isAdmin,clientHoliday);
router.get('/client-holiday',getAllClientHoliday);
router.get('/user-timesheet',auth,generateTimesheet)
router.post('/user-timesheet',auth,generateTimesheetByDate)




export default router;