
const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    accountHolderName:String,
    paymentId:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    location:String,
    paymentOn:String,
    amount:String,
    transactionStatus: {
        type: String,
        default: "Success"
    },
    role: {
        type: String,
        default: "seller"
    }    
})

const payment = mongoose.model('paymentSchema', paymentSchema)

module.exports = { payment }