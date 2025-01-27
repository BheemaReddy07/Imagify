import jwt from 'jsonwebtoken'



const userAuth  = async (req,res,next) =>{
    
        const  {token} = req.headers
        if(!token){
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        try {
        const jwt_decode = jwt.verify(token,process.env.JWT_SECRET)
        if(jwt_decode.id){
            req.body.userId  = jwt_decode.id
        }
        else{
            return res.json({success:false,message:"Not Authorized Login Again"})
        }
        
        next()
        
    } catch (error) {
        console.log("Error in requestForgotPasswordOTP:", error.message);
        res.json({ success: false, message:error.message });
    }
}

export default userAuth