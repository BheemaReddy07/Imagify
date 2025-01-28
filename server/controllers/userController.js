import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import validator from 'validator'
import Stripe from 'stripe'
import transactionModel from "../models/transactionModel.js";


const currency = process.env.CURRENCY


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
        res.json({success:true,token,message:"Registration successful"})
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
            res.json({success:true,token,message:"Login Successful"})
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

        res.json({success:true,message:"password reset successfully"})

        
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




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API for Stripe payment
const paymentStripe = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 50;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 100;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 500;
        break;
      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    const date = Date.now();
    const transactionData = { userId, plan, amount, credits, date };
    const newTransaction = await transactionModel.create(transactionData);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr", // Define your currency
            product_data: {
              name: plan,
              description: `${credits} credits`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&transactionId=${newTransaction._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&transactionId=${newTransaction._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
    try {
      const { transactionId, success } = req.body;
  
      if (!transactionId) {
        return res.status(400).json({ success: false, message: "Missing transaction ID" });
      }
  
      const transaction = await transactionModel.findById(transactionId);
  
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
  
      const userData = await userModel.findById(transaction.userId);
  
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (success) {
        transaction.payment = true;
        await transaction.save();
  
        // Safely parse and validate the existing credit balance
        const currentBalance = Number(userData.creditBalance); // Ensure it's a number
        const transactionCredits = Number(transaction.credits); // Ensure it's a number
  
        if (isNaN(currentBalance) || isNaN(transactionCredits)) {
          return res.status(500).json({ success: false, message: "Invalid data for credit calculation" });
        }
  
        // Calculate the new balance
        const newCredits = currentBalance + transactionCredits;
  
        // Update the user's credit balance
        await userModel.findByIdAndUpdate(
          userData._id,
          { creditBalance: newCredits },
          { new: true } // Return the updated document
        );
  
        return res.status(200).json({ success: true, message: "Payment verified successfully" });
      }
  
      return res.status(400).json({ success: false, message: "Payment not completed" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
  


export {requestOTP ,verifyOTPandRegister,loginUser,requestForgotPasswordOTP , resetPassword,userCredits,paymentStripe,verifyPayment}