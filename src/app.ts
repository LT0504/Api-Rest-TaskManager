import dotenv from 'dotenv'
import express from 'express'
const cors = require("cors");
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.use('/user', userRoutes)

app.use('/task', taskRoutes)

export default app