import express from 'express'
import { autenticateToken } from '../middleware/authMiddleware'
import { createTask, getAllTasks, getTaskById, getTaskByUserId, updateTask, deleteTask, getCompletedTasks, getInProgressTasks, getPendingTasks } from '../controllers/taskController'

const router = express.Router()

router.post('/',createTask )
router.get('/', getAllTasks)
router.get('/:id', getTaskById)
router.get('/users/:userId/tasks',getTaskByUserId)
router.put('/:id',updateTask )
router.delete('/:id', deleteTask)
router.get("/pending/:id", getPendingTasks);
router.get("/in-progress/:id", getInProgressTasks);
router.get("/completed/:id", getCompletedTasks);

export default router