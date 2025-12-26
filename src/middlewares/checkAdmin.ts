import {Response, NextFunction} from "express"
import { AuthenticationRequest } from "./checkAuthenticatedUsers"

export const checkAdmin = (req: AuthenticationRequest, res:Response, next:NextFunction) =>{
    if (req.user && req.user.role === 'admin'){
        next()
    }
    else{
        res.status(403).json({message:"cannot access the route because you are not an admin sire."})
    }
}