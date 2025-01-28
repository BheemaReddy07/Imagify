import express from 'express'
import { loginUser, requestForgotPasswordOTP, requestOTP, resetPassword, userCredits, verifyOTPandRegister } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'
const userRouter = express.Router()


userRouter.post('/register/request-otp',requestOTP)
userRouter.post('/register/verifyotp-register',verifyOTPandRegister)
userRouter.post('/login',loginUser)
userRouter.post('/forgot/request-otp',requestForgotPasswordOTP)
userRouter.post('/forgot/reset',resetPassword)
userRouter.get('/credits',userAuth,userCredits)


export default userRouter