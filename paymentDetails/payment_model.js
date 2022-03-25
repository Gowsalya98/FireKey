
const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    paymentId: String,
    bankName: String,
    paymentMode: String,
    amount: Number,
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