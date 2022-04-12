const{register,otpSchema}=require('./user_model')
const{randomString,makeId}=require('../middleware/randomString')
const{superadmin}=require('../superAdmin/superAdmin_models')
const{property}=require('../propertyDetails/property_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const { validationResult } = require('express-validator')

exports.registerForUser = async(req, res) => {
    try {
        console.log('line 10',req.body)
        const errors = await validationResult(req)
        if (!errors.isEmpty()) {
            console.log("line 11",errors)
            res.status(400).send({ message: errors.array() })
        } else {
            register.countDocuments({ email: req.body.email }, async (err,num) => {
                console.log("line 17",num)
                if (num == 0) {
                    const confirmPassword=req.body.confirmPassword
                   if(req.body.password==confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    //const confirmPassword =await bcrypt.hash(req.body.confirmPassword,10)
                    register.create(req.body, (err, data) => {
                        if (data) {
                            console.log("line 25",data)
                            if(req.body.email == data.email&&req.body.contact==data.contact){
                                const buyerId = makeId(24)
                                console.log("buyerId", buyerId)
                                register.findOneAndUpdate({email:req.body.email},{$set:{buyerId:buyerId}},{new:true},async(err, datas) => {
                                    console.log("line 32", datas)
                                    if (datas) {
                                        console.log("line 35", datas)
                                        postMail( data.email, 'BuyerId For Firekey Site', buyerId)
                                        console.log('line 37', buyerId)
                                        const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:buyerId,numbers:[data.contact]})
                                        console.log('line 38',response)
                                        res.status(200).send({ message: 'Register successfull', data,buyerId})
                                    }else{res.status(400).send('does not create buyer id')}
                                })
                            }else{res.status(400).send('invalid user') }     
                        } else {
                            console.log("line 44",'Register Failed')
                            res.staus(400).send({ message: 'failed to register data' })
                        }
                    })
                   }else{
                       res.status(400).send({message:"password & confirm password does not match"})
                   }
                   
                } else {
                    console.log("line 53","email is already exists")
                    res.status(400).send({ message: 'email is already exists' })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
exports.verificationMailForUser=(req,res)=>{
    try{
        console.log('line 64',req.params.id)
        register.findOne({_id:req.params.id,deleteFlag:"false"},(err,data)=>{
            console.log('line 66',data)
            if(data){
            if(data.buyerId==req.params.buyerId){
                res.status(200).send({message:'verified user',data})
            }else{
                res.status(400).send({message:'unauthorized person'})
            }
        }else{res.status(400).send({message:'invalid id'})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.userLogin = (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
            register.findOne({ email: req.body.email }, async (err, data) => {
                if (data) {
                    const password = await bcrypt.compare(data.password, req.body.password)
                    const userid = data._id
                    const token = jwt.sign({ userid }, 'secretKey')
                    res.status(200).send({ message: "Login Successfully", token, data })
                } else {
                    res.status(400).send({ message: "invaild email" })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.forgetPassword=(req,res)=>{
    try{
        console.log('line 73',req.body.otp)
        if (req.body.otp != null) {
            otpSchema.findOne({ otp: req.body.otp }, async (err, datas) => {
                console.log("line 76", datas)
                if (datas) {
                    const userToken = jwt.decode(req.headers.authorization)
                    const decodeId = userToken.userid
                    register.findOne({ _id: decodeId }, async (err, data) => {
                        console.log("line 81", data)
                        if (data) {
                            if (req.body.email == data.email) {
                                console.log("line 84", req.body.email)
                                console.log("line 85", data.email)
                                if (req.body.newPassword == req.body.confirmNewPassword) {
                                    console.log("line 88", req.body.newPassword)
                                    console.log("line 89",req.body.confirmNewPassword )

                                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
                                    register.findOneAndUpdate({ _id: decodeId }, { password: req.body.newPassword }, (err, result) => {
                                        if (err) { throw err }
                                        else {
                                            res.status(200).send({ message: "Reset Password Successfully", result })
                                        }
                                    })
                                } else { res.status(400).send({ message: 'password and confirm Password does not match' }) }
                            } else { res.status(400).send({ message: 'email does not match ' }) }
                        }
                    })
                } else { res.status(400).send({ message: 'invalid otp' }) }
            })
        } else {
            const userToken = jwt.decode(req.headers.authorization)
            const decodeId = userToken.userid
            register.findById({ _id: decodeId },async (err, data) => {
                console.log("line 108", data)
                if (data) {
                    console.log(req.body.email)
                    if (req.body.email == data.email && req.body.contact==data.contact) {
                        const otp = randomString(3)
                        console.log("otp", otp)
                        otpSchema.create({ userId: decodeId, otp: otp },async (err, datas) => {
                            console.log("line 115", datas)
                            if (err) { throw err }
                            if (datas) {
                                console.log("line 118", datas)
                    
                                postMail( data.email, 'otp for changing password', otp)
                                console.log('line 121', otp)

                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                console.log('line 124',response)
                                res.status(200).send({ message: "verification otp send your email and your mobile number", otp,data,response})
                                setTimeout(() => {
                                        otpSchema.findOneAndDelete({ otp: otp }, (err, result) => {
                                        console.log("line 128", result)
                                        if (err) { throw err }
                                    })
                                }, 200000)
                            }
                        })
                    } else { res.status(400).send({ message: 'email and contact does not match' }) }
                } else { res.status(400).send({ message: 'invalid id' }) }
            })
        } 
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nishagowsalya339@gmail.com',
        pass: '8760167075'
    }
})
const postMail = function ( to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}

exports.getAllUserList = (req, res) => {
    try {
        const superAdminToken=jwt.decode(req.headers.authorization)
        const id=superAdminToken.userid
        superadmin.findOne({_id:id,deleteFlag:"false"},(err,datas)=>{
            if(datas){
                register.find({role:"Buyer",deleteFlag:"false"}, (err, data) => {
                    console.log('line 70',data)
                    if (data) {
                        console.log('line 72',data)
                        res.status(200).send({ message: data })
                    } else {
                        console.log('your data is already deleted')
                        res.status(400).send({ message: 'your data is already deleted' })
                    }
        
                })
            }else{res.status(400).send('unauthorized')}
        })
        
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

exports.getSingleUser = (req, res) => {
    try {
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userid
        register.findOne({ _id:id }, (err, data) => {
            if (err) {
                res.status(400).send({ message: 'something error in this process' })
            } else {
                if (data.deleteFlag == 'false') {
                    console.log(data)
                    res.status(200).send({ message: data })
                } else {
                    console.log('your data is already deleted')
                    res.status(400).send({ message: 'your data is already deleted' })
                }
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

exports.updateUserProfile = async (req, res) => {
    console.log(req.body)
    try {
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userid
        register.findOne({ _id:id,deleteFlag:"false"}, (err, datas) => {
            //console.log(data)
            if (datas) {
        register.findOneAndUpdate({_id:id}, req.body,{ new: true }, (err, data) => {
            console.log('line 241',data)
            if (!err) {
                res.status(200).send({ message: 'updated successfully', data })
            } else {
                res.status(400).send({ message: 'invalid id' })
            }
        })
    }
})
    } catch (err) {
        res.status(500).send({ message: err.message })
    }


}

exports.deleteUserProfile = async (req, res) => {
    try {
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userid
        register.findOne({ _id:id,deleteFlag:"false"}, (err, datas) => {
            //console.log(data)
            if (datas) {
                register.findOneAndUpdate({ _id:id }, { $set: { deleteFlag: "true" } }, { returnOriginal: false }, (err, data) => {
                    if (!err)
                    console.log(data)
                        res.status(200).send({ message: "Delete Data Successfully",data })
                   
                })
            } else { res.status(400).send('Data is not found') }
        })
    } catch (err) { res.status(500).send({ message: err.message }) }
}

exports.searchPropertyForBuyer = async (req, res) => {
    console.log(req.params.key)
    try {
        if (req.body.typeOfLand == 'residential') {
            const data = await property.find({
                "$or":
                    [{ "landDetails.prize": { $regex: req.params.key } },
                    { "areaLocation": { $regex: req.params.key } }
                    ]
            })
            res.status(200).send({ message: "search done", data })
        } else if (req.body.typeOfLand == 'commercial') {
            const data = await property.find({
                "$or": [
                    { "landDetails.prize": { $regex: req.params.key } },
                    { "areaLocation": { $regex: req.params.key } }
                ]
            })
            res.status(200).send({ message: "search done", data })
        } else {
            const data = await property.find({
                "$or": [
                    { "landDetails.prize": { $regex: req.params.key } },
                    { "areaLocation": { $regex: req.params.key } }
                ]
            })
            res.status(200).send({ message: "search done", data })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

}
