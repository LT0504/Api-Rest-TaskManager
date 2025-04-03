import { User } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

export const generateToken = (user:User): String =>{
    return jwt.sign(
        {
            id:user.id,
            name: user.name,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )
}