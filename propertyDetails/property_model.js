
const mongoose = require('mongoose')

const Residential_Commercial_Land_Schema = mongoose.Schema({
    propertyName: String,
    configuration: {
        type: String,
        default: " "
    },
    plotNo:{
        type:String,
        default:""
    },
    squareFt: String,
    price: String,
    fixedPrice:String,
    negotiable:String
})
const addPropertySchema = mongoose.Schema({
    createdAt:String,
    agentOrOwnerName: String,
    email: String,
    contact: Number,
    typeOfLand: String,
    sellOrRentOrLease:String,
    landDetails: Residential_Commercial_Land_Schema,
    areaLocation: String,
    street:String,
    city: String,
    state: String,
    pincode: String,
    landImage: String,
    ownerShip: String,
    remarks: String,
    deleteFlag: {
        type: String,
        default: false
    },
    role:{
        type:String,
        default:'Seller'
    },
    propertyId:String
})

const property=mongoose.model('propertySchema',addPropertySchema)

module.exports = { property}