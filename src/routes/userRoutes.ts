import express from 'express'
import { autenticateToken } from '../middleware/authMiddleware'
import { createUser, deleteUser, getAllUsers, getUserByID, updateUser } from '../controllers/userController'

const router = express.Router()

router.post('/', autenticateToken, createUser)
router.get('/',autenticateToken, getAllUsers)
router.get('/:id',autenticateToken, getUserByID)
router.put('/:id',autenticateToken, updateUser)
router.delete('/:id',autenticateToken, deleteUser)

export default router