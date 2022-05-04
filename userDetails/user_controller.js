
const mongoose = require('mongoose')
const{register,otpSchema}=require('./user_model')
const{randomString}=require('../middleware/randomString')
const{property}=require('../propertyDetails/property_model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')


exports.register= async(req, res) => {
    try {
            const num= await register.aggregate([{$match:{ email: req.body.email }}])
                if (num.length== 0) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    req.body.createdAt=new Date().toString().substring(0,10)
                    register.create(req.body, (err, data) => {
                        if (data) {
                            res.status(200).send({ success:'true',message: 'Register successfull', data})    
                        } else {
                             res.staus(400).send({ success:'false',message: 'failed to register data' })
                        }
                   })
                } else {
                    res.status(400).send({success:'false',message:'your email already exists,please try another'})
                }
    } catch (err) {
        console.log(err)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

exports.login = async(req, res) => {
    try {
            const data=await register.findOne({ email: req.body.email},{deleteFlag:false})
                if (data) {
                    console.log('line 84',data)
                     const password=await bcrypt.compare(req.body.password,data.password)
                    if(password==true){
                        console.log('line 87',password)
                    const token = (jwt.sign({id:data._id}, 'secretKey'))
                    res.status(200).send({ success:'true',message: "Login Successfully", token, data:data })
                } else {
                    res.status(200).send({ success:'false',message: "invaild password",data:[]})
                }
        }else{res.status(400).send({ success:'false',message: "data not exist",data:[]})}
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
                    const decodeId = userToken.id
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
            const decodeId = userToken.id
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
        if(data.length!=0){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All datas',data:data})
        }else{
            res.status(302).send({success:'false',message:'data not found',data:[]})
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
            if(req.params.userId.length==24){
                const data=await register.findByIdAndUpdate({_id:req.params.userId},{$set:req.body},{ new: true})
                if (data) {
                    res.status(200).send({ success:'true',message: 'updated successfully',data:data })
                } else {
                    res.status(302).send({success:'false',data:[]})
                }
            }else{
                res.status(400).send({ message: "please provide a valid id" })
            }
      
        }else{ res.status(400).send({ message: "unauthorized" })}
    } catch (err) {
        res.status(500).send({message:"internal server error"})
    }
}

exports.deleteUserProfile = async (req, res) => {
    try {
        if(req.headers.authorization){
            if(req.params.userId.length==24){
                const data=await register.findOneAndUpdate({ _id:req.params.userId }, { $set: { deleteFlag: "true" } }, { returnOriginal: false })
                if(data!=null){
                    res.status(200).send({ success:'true',message: "Delete Data Successfully",data:data })
                } else { 
                    res.status(302).send({success:'false',data:[]})
                }
            }else{
                res.status(400).send({ message: "please provide a valid id" })
            }
        
    }else{
        res.status(400).send({ message: "unauthorized" })
    }
    } catch (err) { res.status(500).send({ message: "internal server error" }) }
}

exports.searchPropertyForBuyer = async (req, res) => {
   try{
       const data=await property.aggregate([{$match:{$and:[{"propertyType":req.body.propertyType},{"propertyStatus":req.body.propertyStatus},
       {"nearBySchool":req.body.nearBySchool}]}}])
    } catch (err) {
        res.status(500).send(res.status(500).send({ message: "internal server error" }))
    }

}
