
const mongoose=require('mongoose')

const interestBuyerSchema = mongoose.Schema({
    propertyDetails:{
        type:Object
    },
    userDetails:{
        type:Object
    },
    interest:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:String,
        default:new Date()
    }
})

const interestBuyer = mongoose.model('interestBuyerSchema', interestBuyerSchema)

module.exports = { interestBuyer }