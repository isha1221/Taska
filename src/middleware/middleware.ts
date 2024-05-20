import { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || '';
const checkUserAuth = (req:Request,res:Response,next:NextFunction)=>{
    const token= req.cookies.token;
    if(token){
        try {
            const user= jwt.verify(token,jwtSecret) as JwtPayload;
           
        } catch (error) {
            
        }
    }
}