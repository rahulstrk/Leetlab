import bcrypt from "bcryptjs";
import {db} from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
export const register = async ( req , res ) => {
    const {email , password, name} = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existingUser)
        {
            return res.status(400).json({
                error:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await db.user.create({
            data:{
                email,
                password: hashedPassword,
                role:UserRole.USER,
                name
            }
        })

        const token = jwt.sign({
            id:newUser.id
        }, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie("jwt", token,{
            httpOnly: true,
            sameSuite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7 //7 days
        })

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }
        })
    } catch (error) {
        console.error("Error occured while creating user", error);
        res.status(500).json({
            error:"Error creating user"
        })
    }
}

export const login = async (req, res) => {
    const {email,password} = req.body;

    try {
      
        //check if exists or not in the database
        const user = await db.user.findUnique({
            where:{
                email
            }
        })
        //if user not found return the error message in response
        if(!user){
            return res.status(401).json({
                error:"User not found"
            })
        }

        const isMatched = await bcrypt.compare(password,user.password);

        if(!isMatched){
            return res.status(401).json({
                error:"Invalid credentials"
            })
        }

        const token = jwt .sign({id:user.id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            samesite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 *24 * 7 //7 days
               })

        res.status(200).json({
            success:true,
            message:"User Logged in Successfully",
            user:{
                id:user.id,
                email:user.email,
                name:user.name,
                role:user.role,
                image:user.image
            }
        })
    } catch (error) {
        console.error("Error occured while creating user", error);
        res.status(500).json({
            error:"Error logging in user"
        })
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            samesite:"strict",
            secure:process.env.NODE_ENV !== "development"
        })

        res.status(200).json({
            success:true,
            message:"User logged out succesfully"
        })
    } catch (error) {
        console.error("Error logging out user:",error);
        res.status(500).json({
            error:"Error logging out user"
        })
    }

}

export const check = async (req, res) => {
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated successfully",
            user:req.user
        });
    } catch (error) {
        console.error("Error checing user:",error);
        res.status(500).json({
            error:"Error while checking user"
        })
    }
}