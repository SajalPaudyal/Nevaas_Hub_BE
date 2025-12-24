import {Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const checkAuthenticatedUsers = (req:any, res:Response, next:NextFunction) =>{
    const token  = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(400).json({message:"Cannot authenticate. Invalid token."})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    }
    catch(e:any){
        res.status(400).json({message:"Cannot authenticate. Invalid token."})
    }
}