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

const superadmin = mongoose.model("superAdminSchema", superAdminSchema)

module.exports = { superadmin }
