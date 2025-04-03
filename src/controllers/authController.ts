import { Response, Request, response } from "express"
import { comparePassword, hashPassword } from "../services/password.service"
import prisma from '../models/user'
import { compare } from "bcrypt"
import { generateToken } from "../services/auth.service"


export const register = async(req:Request, res: Response):Promise<void>=>{
    const {name, email, password} = req.body

    try {
        if(!name || !email || !password){
            res.status(400).json({message:"Complete los campos"})
            return
        }

        const hashedPassword = await hashPassword(password)

        const user = await prisma.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })

        const token = generateToken(user)

        res.status(200).json({token})

    } catch (error:any) {

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "El mail ingresado ya existe" })
            return
        }

        console.log(error)
        res.status(500).json({error:"Hubo un error, pruebe mas tarde"})
        return
    }

}

export const login = async(req:Request, res:Response): Promise<void> =>{
    const {email, password} = req.body
    try {
        if(!email){
            res.status(400).json({error:'El email es obligatorio'})
            return
        }

        if(!password){
            res.status(400).json({error:'El password es obligatorio'})
            return
        }

        const user = await prisma.findUnique({
            where:{
                email
            }
        })

        if(!user){
            res.status(400).json({error:'Usuario no encontrado'})
            return
        }

        const passwordMatch = await comparePassword(password, user.password)

        if(!passwordMatch){
            res.status(401).json({error:'Usuario y contraseña no coinciden'})
            return
        }

        const token = generateToken(user)
        res.status(200).json({token})

    } catch (error) {
        console.log('Error', error)
        res.status(500).json({error: 'Hubo un problema, pruebe mas tarde'})
    }
}