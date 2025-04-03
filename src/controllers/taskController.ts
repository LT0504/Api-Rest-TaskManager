import prisma from '../models/task'
import { Request, Response } from 'express'
import prismaUser from '../models/user'
import task from '../models/task'

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { userId, title, description, status, priority, dueDate } = req.body
    try {

        const user = await prismaUser.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            res.status(200).json({ message: 'No se encontro el usuario' })
            return
        }
        const task = await prisma.create({
            data: {
                title,
                description,
                status: status || 'Pendiente',
                priority,
                dueDate,
                userId
            }
        })
        res.status(200).json({ task })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un problema, intente mas tarde' })
        return
    }
}

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await prisma.findMany()
        res.status(200).json({ tasks })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }
}

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id)
    try {
        const task = await prisma.findUnique({
            where: {
                id: taskId
            }
        })
        if (!task) {
            res.status(200).json({ message: 'No se encontro la tarea' })
            return
        }
        res.status(200).json({ task })
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }
}

export const getTaskByUserId = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId)
    try {
        const tasks = await prisma.findMany({
            where: {
                userId: userId
            }
        })
        if (tasks.length === 0) {
            res.status(200).json({ message: "No se encontraron tareas para este usuario" });
            return;
        }
        res.status(200).json({ tasks })
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json({ error: 'No se encontro el usuario' })
            return
        }
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }
}

export const getPendingTasks = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const tasks = await prisma.findMany({
            where: {
                userId: userId,
                status: "Pendiente"
            }
        })

        if (tasks.length === 0) {
            res.status(200).json({ message: "No se encontraron tareas pendiendes" })
            return
        }
        res.status(200).json({ tasks })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }
}

export const getInProgressTasks = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const tasks = await prisma.findMany({
            where:{
                userId: userId,
                status: "En curso"
            }
        })
        
        if(tasks.length === 0){
            res.status(200).json({message: "No se encontraron tareas en curso"})
            return
        }

        res.status(200).json({tasks})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Hubo un problema, puede mas tarde'})
        return
    }
}

export const getCompletedTasks = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const tasks = await prisma.findMany({
            where:{
                userId: userId,
                status: "Completada"
            }
        })

        if(tasks.length===0){
            res.status(200).json({message:'No se encontraron tareas completadas'})
            return
        }
        res.status(200).json({tasks})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Hubo un problema, pruebe mas tarde'})
        return
    }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id)
    const { title, description, status, priority, dueDate } = req.body

    try {
        const dataUpdate: any = { ...req.body }
        if (title) dataUpdate.title = title
        if (description) dataUpdate.description = description
        if (status) dataUpdate.status = status
        if (priority) dataUpdate.priority = priority
        if (dueDate) dataUpdate.dueDate = dueDate

        const task = await prisma.update({
            where: {
                id: taskId
            },
            data: dataUpdate
        })

        res.status(200).json({ task })
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json({ error: 'No se encontro el usuario' })
            return
        }
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }

}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const taskId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: taskId
            }
        })
        res.status(200).json({
            message: `La tarea ${taskId} ha sido eliminada`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json({ error: 'No se encontro la tarea' })
            return
        }
        console.log(error)
        res.status(500).json({ error: 'Hubo un problema, intente mas tarde' })
        return
    }
}