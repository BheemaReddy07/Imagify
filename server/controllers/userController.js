import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import validator from 'validator'


//function to generate the otp
const generateOTP = () =>{
    return Math.floor(100000 + Math.random()*900000).toString()
}


//function to send mail to the reciever

const sendOTPEmail = async (email,otp ,name) =>{
    const transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.MAIL_SENDER_MAIL,
            pass:process.env.MAIL_SENDER_PASS,
        }
    })
    const mailOptions = {
        from:process.env.MAIL_SENDER_MAIL,
        to:email,
        subject:"Your OTP Code",
        text:`Hi ${name ? name:""}!! Greetings from Imagify,  here is your otp code ${otp}`,
    }
    try {
        await transport.sendMail(mailOptions)
        console.log("OTP email sent successfully");
        
    } catch (error) {
        console.log("Error Sending OTP email");
        throw new Error('Error sending OTP email');
    }
}


//API to request otp
const requestOTP = async (req,res) =>{
    try {
        const {name,email,password,repassword} = req.body
        if(!name || !email || !password || !repassword){
            return res.json({success:false,message:"Missing details"})
        }
        if(!validator.isEmail(email)){
            return res.json ({success:false,message:"Enter a Valid Email"})
        }
        if(password.length < 8 ){
            return res.json ({success:false,message:"Enter a Strong Password"})
        }
        if(password != repassword){
            return res.json ({success:false,message:"Password not matching"})
        }
        const user =  await userModel.findOne({email})

        if(user && user.verified){
            return res.json ({success:false,message:"User Already Exists"})
        }
        const otp = generateOTP()
        console.log(otp);
        const otpExpiration = Date.now() + 3*60*1000;
        if(user && !user.verified){
            user.otp = otp
            user.otpExpiration = otpExpiration
            await user.save()
        }
        else{
            const userData = new userModel({
             name,
             email,
             password,
             otp,
            otpExpiration,
            verified:false 
            })
            await userData.save()
        }
        await sendOTPEmail(email,otp,name)
        res.json({success:true,message:"OTP sent successfully"})
        
    } catch (error) {
        console.log('Error in request otp :',error.message)
        res.json({success:false,message:"Error sending OTP"})
    }
}



//API to verify otp and register the user

const verifyOTPandRegister = async (req,res) =>{
    const {name,email,password,otp} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"No user Found"})
        }
        if(user.otp != otp || Date.now() > user.otpExpiration){
            return res.json({success:false,message:"Invalid or Expired OTP"})
        }

        const salt  =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        await userModel.findByIdAndUpdate(user._id,{
            name,
            password:hashedPassword,
            otp:null,
            otpExpiration:null,
            verified:true
        })
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})
    } catch (error) {
        console.log('Error in request otp :',error.message)
        res.json({success:false,message:error.message})
    }
}


//API for user LOgin
const loginUser  = async (req,res) =>{
    try {
        const {email,password} = req.body
        const user  = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User not Found"})
        }
        if(user && !user.verified){
            return res.json({success:false,message:"User not Found"})
        }
       
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credentials"})
        }

    } catch (error) {
        console.log('Error in request otp :',error.message)
        res.json({success:false,message:error.message})
    }
}

//API for requesting otp for the frogotpassword
const requestForgotPasswordOTP = async (req, res) => {
    try {
        const { email, password, repassword } = req.body;

        if (!email || !password || !repassword) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.verified) {
            return res.json({ success: false, message: "User is not verified" });
        }

        if (password !== repassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiration = Date.now() + 3 * 60 * 1000; // 3 minutes expiration
        await user.save();

        await sendOTPEmail(email, otp, user.name); // Use user.name if available
        res.json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.log( error.message);
        res.json({ success: false, message: "Error sending OTP" });
    }
};


//API to reset the password
const resetPassword = async (req,res) =>{
    try {
        const {email,password,otp} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        if(user.otp !== otp || Date.now() > user.otpExpiration){
            return res.json({success:false,message:"Invalid or expired otp"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        user.password = hashPassword
        user.otp = null
        user.otpExpiration = null
        await user.save()

        res.json({success:true,message:"message reset successfully"})

        
    } catch (error) {
        console.log( error.message);
        res.json({ success: false, message:error.message });
    }
}

const cleanupExpiredUsers = async (req,res) =>{
    try {
        const  now  = Date.now()
        const expiredUsers = await userModel.find({
            verified:false,
            otpExpiration:{$lt:now},
        })
        if(expiredUsers.length > 0){
            await userModel.deleteMany({
                verified:false,
                otpExpiration:{$lt:now}
            })
        }

    } catch (error) {
        console.log( error.message);
        res.json({ success: false, message:error.message });
    }
}


const Hour = 1 * 60 *1000
setInterval(cleanupExpiredUsers,Hour)

const userCredits = async (req,res) =>{
    try {
        const {userId} = req.body
        const user = await userModel.findById(userId)
        res.json({success:true,credits:user.creditBalance})
    } catch (error) {
        console.log( error.message);
        res.json({ success: false, message:error.message });
    }
}


export {requestOTP ,verifyOTPandRegister,loginUser,requestForgotPasswordOTP , resetPassword,userCredits}