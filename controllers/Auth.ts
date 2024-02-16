import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User';

import dotenv from 'dotenv';
dotenv.config();



// signup
export const signup = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(403).send({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Password and Confirm Password do not match. Please try again",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
}



// login

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).send({
                success: false,
                message: "All fields are required",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        const payload = {
            email: user.email,
            id: user._id
        }

        if (await bcrypt.compare(password, user.password)) {

            const jwtSecret = process.env.JWT_SECRET || 'sonu';
            console.log(jwtSecret)
            const token = jwt.sign(
                payload,
                jwtSecret,
                {
                    expiresIn: '2h'
                });


            user = user.toObject();
            user.token = token;

            const options = {
                expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user login successfully."
            });


        } else {
            res.status(403).json({
                success: false,
                message: "password incorrect."
            })
        }




    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "login failed",
            success: false,
        })
    }

}