const mongoose = require('mongoose')

const reportPropertySchema = mongoose.Schema({
    reportImage: String,
    message: String,
    userData:{
        type:Object
    },
    propertyData:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:false
    }
})

const reportProperty = mongoose.model("reportSchema", reportPropertySchema)

module.exports = { reportProperty }