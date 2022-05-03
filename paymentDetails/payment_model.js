
const mongoose = require('mongoose')

const paymentSchema=mongoose.Schema({
    paymentId:String,
    // sixMonthSubcription:String,
    // threeMonthSubcription:String,
    // oneYearSubcription:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const transactionSchema=mongoose.Schema({
    paymentId:String,
    accountHolderName:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    subscriptionPlan:String,
    subscriptionAmount:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    ownerId:String,
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:String,
        default:'0'
    }

})

const payment=mongoose.model('paymentSchema',paymentSchema)
const transaction=mongoose.model('transactionSchema',transactionSchema)

module.exports={
    payment,transaction
}
