
const mongoose = require('mongoose')
const {body,validationResult}=require('express-validator')

const Residential_Commercial_Land_Schema = mongoose.Schema({
    propertyName: String,
    BHK:String,
    plotNo:{
        type:String,
        default:""
    },
    squareFt:String,
    price: String
})
const propertySchema = mongoose.Schema({
    contactPerson: String,
    ownerShip: String,
    email: String,
    contact: Number,
    propertyType: String,
    propertyStatus:String,
    propertyOwnerId:String,
    landDetails: Residential_Commercial_Land_Schema,
    location:{
        propertyLatitude:String,
        propertyLongititude:String
    },
    Address:String,
    city: String,
    pincode:Number,
    propertyImage: String,
    label:String,
    description: String,
    storage: {
        type: Boolean,
        default: false
    },
    balcony: {
        type: Boolean,
        default: false
    },
    parkking:{
        type:Boolean,
        default:false
    },
    nearByPark:{
        type:Boolean,
        default:false
    },
    nearBySchool:{
        type:Boolean,
        default:false
    },
    nearByPlayGrounds:{
        type:Boolean,
        default:false
    },
    nearByHospitals:{
        type:Boolean,
        default:false
    },
    nearByBusStop:{
        type:Boolean,
        default:false
    },
    swimmingPool:{
        type:Boolean,
        default:false
    },
    discount:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    deleteFlag:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:0
    },
    packageStatus:{
        type:String,
        default:'free'
    },
    
})
const propertyImageSchema=mongoose.Schema({
    propertyImage:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const validation = [
    body('email').trim().isEmail().withMessage('email is required'),
    body('contact').isMobilePhone().withMessage('contact is required'),
    body('Address').isLength({min:1}).withMessage('Address is required'),
    //body('landDetails.propertyName').isAlphanumeric().withMessage('propertyName is required'),
    body('city').isString().withMessage('city is required')
]

const property=mongoose.model('propertySchema',propertySchema)
const image=mongoose.model('propertyImageSchema',propertyImageSchema)


module.exports = { property,image,validation}