
const mongoose = require('mongoose')
const {body,validationResult}=require('express-validator')

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
    minSquareFt: String,
    maxSquareFt:String,
    price: String
})
const propertySchema = mongoose.Schema({
    agentOrOwnerName: String,
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
    propertyImage: String,
    ownerShip: String,
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
    parking:{
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
    nearByGrounds:{
        type:Boolean,
        default:false
    },
    nearByHospitals:{
        type:Boolean,
        default:false
    },
    nearByTransport:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    deleteFlag:{
        type:Boolean,
        default:false
    },
    rating:{
        type:String,
        default:'0'
    },
    packageStatus:{
        type:String,
        default:'free'
    },
    
})

const ratingSchema=mongoose.Schema({
    deleteFlag:{
        type:Boolean,
        default:false
    },
    rating:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
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
    body('address').isLength({min:1}).withMessage('address is required'),
    body('propertyName').isAlphanumeric().withMessage('property name is required'),
    body('city').isString().withMessage('city is required')
]

const property=mongoose.model('propertySchema',propertySchema)
const image=mongoose.model('propertyImageSchema',propertyImageSchema)
const rating=mongoose.model('ratingSchema',ratingSchema)

module.exports = { property,image,rating,validation}