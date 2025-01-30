import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRoutes.js'

const app = express()
app.use(cors({
    origin: [
        'https://film-finderrr.netlify.app', // Production frontend
        'http://localhost:3000' // For local development
        ],
      credentials: true // Enable if using cookies/tokens
}))
app.use(express.json())
app.use('/auth', authRouter)

app.listen(process.env.PORT, () => {
    console.log("Server is Running")
})