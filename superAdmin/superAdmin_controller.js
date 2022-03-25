const {superadmin} = require('./superAdmin_models')
const{property}=require('../propertyDetails/property_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

exports.superAdminRegister = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
            superadmin.findOne({ email: req.body.email }, async (err, data) => {
                console.log(data)
                if (data == null) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    superadmin.create(req.body, (err, data) => {
                        if (err) throw err
                        console.log(data)
                        res.status(200).send({ message: "Successfully Registered", data })
                    })
                } else {
                    res.status(400).send({ message: "This Email already Exists" })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.superAdminLogin = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(err)
            return res.status(400).send({ errors: errors.array() })
        } else {
            superadmin.findOne({ email: req.body.email }, async (err, data) => {
                console.log('line 42',data)
                if (data) {
                    console.log('line 44',data)
                    const password = await bcrypt.compare(req.body.password, data.password)
                    if (password == true) {
                        const userid = data._id
                        const token = jwt.sign({ userid }, 'secretKey')
                        console.log('line 45',data)
                        res.status(200).send({ message: "Login Successfully", token,data })
                    } else {
                        res.status(400).send({ message: "Incorrect Password" })
                    }

                } else {
                    res.status(400).send({ message: "invaild email" })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.getAllPropertyList=(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        const id=superAdminToken.userid
        superadmin.findOne({_id:id,deleteFlag:"false"},(err,datas)=>{
            if(datas){
        property.find({deleteFlag:'false'}, (err, data) => {
            if(err)throw err
            console.log(data)
            res.status(200).send({ message: data })
    })
    }else{
        res.staus(400).send('unauthorized')
    }
        })
    }catch (err) {
        res.status(500).send({ message: err.message })
    }

}



