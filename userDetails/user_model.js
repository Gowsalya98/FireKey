const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator')


const registerSchema = mongoose.Schema({
    userName: String,
    email: String,
    contact:Number,
    password: String,
    newPassword:String,
    confirmPassword:String,
    receiveNewsLetter:String,
    deleteFlag: {
        type: Boolean,
        default: false
    },
    paymentStatus:{
        type:String,
        default:'free'
    },
    createdAt:{
        type:String
    },
    paymentId:{
        type:String,
        default:'0'
    },
    subscriptionStartDate:{
        type:String,
        default:'0'
    },
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:Number,
        default:0
    }
})

const otp = mongoose.Schema({
    userId: {
        type: String
    },
    otp: Number
})

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({ min: '5', max: '10' }).withMessage('Password must be 5 Character')
]

const register = mongoose.model("registerSchema", registerSchema)
const otpSchema =mongoose.model('otp',otp)

module.exports = { register,otpSchema,validation }