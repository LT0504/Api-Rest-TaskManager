import prisma from '../models/user'
import { Request, Response } from 'express'
import { hashPassword } from '../services/password.service'
import { json } from 'stream/consumers'

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body
    try {
        if (!name) {
            res.status(400).json({ message: 'El nombre es obligatorio' })
            return
        }
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }
        const hashedPassword = await hashPassword(password)
        const user = await prisma.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        res.status(200).json({ user })
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "El mail ingresado ya existe" })
            return
        }
        console.log(error)
        res.status(500).json({ message: 'Hubo un error, pruebe mas tarde' })
        return
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json({ users })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un error, pruebe mas tarde' })
        return
    }
}

export const getUserByID = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(400).json({ message: 'No se encontro el usuario' })
            return
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un error, pruebe mas tarde' })
        return
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { name, email, password } = req.body
    try {
        const dataUpdate: any = { ...req.body }
        if (password) {
            const hashedPassword = await hashPassword(password)
            dataUpdate.password = hashedPassword
        }
        if (name) dataUpdate.name = name
        if (email) dataUpdate.email = email
        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataUpdate
        })
        res.status(200).json({ user })
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: "El email ingresado ya existe" })
            return
        } else if (error?.code == 'P2025') {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })
        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminados`
        }).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe mas tarde' })
        return
    }
}