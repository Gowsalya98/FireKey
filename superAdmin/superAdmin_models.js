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

const package=mongoose.model('packageSchema',packageSchema)

const superadmin = mongoose.model("superAdminSchema", superAdminSchema)

module.exports = { superadmin,package }
