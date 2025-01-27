
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './Routes/userRoute.js'
import imageRouter from './Routes/imageRoute.js'

const port = process.env.PORT || 4000
 

 connectDB()
const app = express()


app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.get('/',(req,res)=>{
    res.send('API IS WORKING')
})


app.listen(port,()=>console.log('server started',port))