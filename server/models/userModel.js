import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,Unique:true},
    password:{type:String,required:true},
    creditBalance:{type:Number,default:5},
    otp:{type:String},
    otpExpiration:{type:Date},
    verified:{type:Boolean,default:false}
})

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel