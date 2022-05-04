const mongoose = require('mongoose')

const superAdminSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "superadmin"
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
    
})

const packageSchema=mongoose.Schema({
    subscriptionPackageName:String,
    subscriptionAmount:Number,
    createdAt:{
        type:Date,
        default:new Date()
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
    
})

const contactUsSchema=mongoose.Schema({
    userName:String,
    email:String,
    phoneNumber:Number,
    message:String,
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const superadmin = mongoose.model("superAdminSchema", superAdminSchema)

const package=mongoose.model('packageSchema',packageSchema)

const contactForAdmin=mongoose.model('contactUsSchema',contactUsSchema)

module.exports = { superadmin,package,contactForAdmin}
