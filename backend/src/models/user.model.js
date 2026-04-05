import mongoose from 'mongoose'

const userSchema= new mongoose.Schema({
username:{
    type:String,
    unique:[true,"username already taken"],
    required:true,
},
email:{
    type:String,
    required:true,
    unique:[true,"account already exists with this email"]
},
password:{
    type:String,
    required:true,

}
})

const userModel=mongoose.model("users",userSchema)

export default userModel