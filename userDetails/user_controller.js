const{register,otpSchema}=require('./user_model')
const{randomString,makeId}=require('../middleware/randomString')
const{superadmin}=require('../superAdmin/superAdmin_models')
const{property}=require('../propertyDetails/property_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

exports.registerForUser = async(req, res) => {
    try {
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.json({message:errors.array()})
        }else{
            const num= await register.aggregate([{$match:{ email: req.body.email }}])
                console.log("line 17",num)
                if (num.length== 0) {
                   if(req.body.password==req.body.confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    req.body.confirmPassword=await bcrypt.hash(req.body.confirmPassword,10)
                    register.create(req.body, (err, data) => {
                        if (data) {
                            // console.log("line 25",data)
                            // if(req.body.email == data.email&&req.body.contact==data.contact){
                            //     const buyerId = makeId(24)
                            //     console.log("buyerId", buyerId)
                            //     register.findOneAndUpdate({email:req.body.email},{$set:{buyerId:buyerId}},{new:true},async(err, datas) => {
                            //         console.log("line 32", datas)
                            //         if (datas) {
                            //             console.log("line 35", datas)
                            //             postMail( data.email, 'BuyerId For Firekey Site', buyerId)
                            //             console.log('line 37', buyerId)
                            //             const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:buyerId,numbers:[data.contact]})
                            //             console.log('line 38',response)
                                        res.status(200).send({ success:'true',message: 'Register successfull', data})
                                   // }else{res.status(400).send('does not create buyer id')}
                                //})
                           // }else{res.status(400).send({success:'false',message:'invalid user'}) }     
                        } else {
                             res.staus(400).send({ success:'false',message: 'failed to register data' })
                        }
                   })
                   }else{
                       res.status(400).send({success:'false',message:'password & confirm password does not match'})
                   }
                   
                } else {
                    res.status(400).send({success:'false',message:'your email already exists,please try another'})
                }
        }
    } catch (err) {
        res.status(500).send({success:'false',message:'internal server error'})
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
        res.status(500).send({message:"internal server error"})
    }
}

exports.userLogin = async(req, res) => {
    try {
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.json({message:errors.array()})
        } else {
            console.log(req.body)
            const data=await register.findOne({ email: req.body.email})
                if (data) {
                    console.log('line 84',data)
                     const password=await bcrypt.compare(req.body.password,data.password)
                    if(password==true){
                        console.log('line 87',password)
                    const token = (jwt.sign({id:data._id}, 'secretKey'))
                    res.status(200).send({ success:'true',message: "Login Successfully", token, data:data })
                } else {
                    res.status(400).send({ success:'false',message: "invaild password",data:[]})
                }
        }else{res.status(400).send({ success:'false',message: "data not exist",data:[]})}
    }
    } catch (err) {
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
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

exports.getAllUserList = async(req, res) => {
    try {
        const data=await register.aggregate([{$match:{"deleteFlag":false}}])
        console.log('line 190',data)
        if(data.length!=0){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All datas',data:data})
        }else{
            res.status(400).send({success:'false',message:'data not found',data:[]})
        }
        
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

exports.getSingleUser = async(req, res) => {
    try {
        if(req.params.userId.length==24){
            const data=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.userId)},{'deleteFlag':false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data',data:data})
            }else{
                res.status(302).send({success:'false',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'please provide a valid id'})
        }
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        if(req.headers.authorization){
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.id
       const data=await register.findByIdAndUpdate({_id:id},{$set: req.body},{ new: true })
            if (data!=null) {
                res.status(200).send({ success:'true',message: 'updated successfully',data:data })
            } else {
                res.status(302).send({success:'false',data:[]})
            }
        }else{ res.status(400).send({ message: "unauthorized" })}
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

exports.deleteUserProfile = async (req, res) => {
    try {
        if(req.headers.authorization){
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.id
        const data=await register.findOneAndUpdate({ _id:id }, { $set: { deleteFlag: "true" } }, { returnOriginal: false })
            if (data!=null){
                        res.status(200).send({ success:'true',message: "Delete Data Successfully",data:data })
                } else { res.status(302).send({success:'false',data:[]})}
    }else{
        res.status(400).send({ message: "unauthorized" })
    }
    } catch (err) { res.status(500).send({ message: "internal server error" }) }
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
