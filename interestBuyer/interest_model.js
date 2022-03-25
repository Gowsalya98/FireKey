
const mongoose=require('mongoose')

const interestBuyerSchema = mongoose.Schema({
    dateTime: {
        type: String,
        default: new Date()
    },
    userData:{
        type:Object
    },
    propertyData:{
        type:Object
    }
})

const interestBuyer = mongoose.model('interestBuyer', interestBuyerSchema)

module.exports = { interestBuyer }