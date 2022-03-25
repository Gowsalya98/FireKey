const mongoose = require('mongoose')

const superAdminSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "superadmin"
    },
    deleteFlag:{
        type:String,
        default:false
    }
})

const superadmin = mongoose.model("superAdminSchema", superAdminSchema)

module.exports = { superadmin }
