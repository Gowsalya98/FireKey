const mongoose = require('mongoose')

const userRegisterSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    newPassword:String,
    contact: Number,
    buyerId:String,
    deleteFlag: {
        type: String,
        default: false
    },
    role:{
        type:String,
        default:"Buyer"
    }

})

const otp = mongoose.Schema({
    userId: {
        type: String
    },
    otp: Number
})

const register = mongoose.model("userRegister", userRegisterSchema)
const otpSchema =mongoose.model('otp',otp)

module.exports = { register,otpSchema }