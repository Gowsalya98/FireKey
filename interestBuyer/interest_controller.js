const {interestBuyer} = require('./interest_model')
const {property} = require('../propertyDetails/property_model')
const {register}=require('../userDetails/user_model')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.interestBuyer = async (req, res) => {
    try {
        if(req.headers.authorization){
            const userToken=jwt.decode(req.headers.authorization)
            const user=await interestBuyer.aggregate([{$unwind:{path:'$propertyDetails'}},
            {$unwind:{path:'$userDetails'}},{$match:{$and:[{"propertyDetails._id":new mongoose.Types.ObjectId(req.params.propertyId)},
            {"userDetails._id":new mongoose.Types.ObjectId(userToken.id)}]}}])
            if(user.length==0){
                if(req.body.interest==true){
                    const user=await register.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(userToken.id)}},{$match:{"deleteFlag":false}}])
                    req.body.userDetails=user[0]

                    const land=await property.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.propertyId)}},{$match:{"deleteFlag":false}}])
                    req.body.propertyDetails=land[0]

                    interestBuyer.create(req.body,async(err,data)=>{
                        if(data){
                            const r=await postMail(req.body.propertyDetails.email, 'Firekey Site','SomeOne Like Your Site' )
                            res.status(200).send({success:'true',message:'created and mail send successfully',data})
                        }else{
                            res.status(400).send({success:'false',message:'failed to create'})
                        }
                    })
                }
            }else{
                    const data=await interestBuyer.findByIdAndUpdate({_id:user[0]._id},req.body,{new:true})
                    res.status(200).send({success:'true',message:'unliked successfully',data})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
    } catch (err) {
        res.status(500).send({message:'internal server error'})
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
        text: text
    })
}

exports.getAllInterestBuyerList =  async(req, res) => {
    try {
       if(req.headers.authorization){
           const userToken=jwt.decode(req.headers.authorization)

           if(userToken){
            const data=await register.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(userToken.id)}}])
            if(data[0].paymentStatus=='paid'){
                const datas=await transaction.aggregate([{$match:{"orderId":data[0].orderId}}])
                if(datas.length!=0){
                    if(data[0].subscriptionEndDate > moment(new Date()).toISOString()){
                        const result=await interestBuyer.aggregate([{$match:{"interest":true}},{$unwind:{path:"$propertyDetails"}},{$unwind:{path:"$userDetails"}},{$match:{$and:[{'propertyDetails.propertyOwnerId':(userToken.id)},{"propertyDetails.deleteFlag":false}]}}]) 
                        console.log(result.length)
                     res.status(200).send({success:'true',message:'fetch data successfully',data})
                    }else{
                        const result=await interestBuyer.aggregate([{$match:{"interest":true}},{$unwind:{path:"$propertyDetails"}},{$unwind:{path:"$userDetails"}},{$match:{$and:[{'propertyDetails.propertyOwnerId':(userToken.id)},{"propertyDetails.deleteFlag":false}]}},{$match:{"userDetails.deleteFlag":false}},{$limit:2}])
    
                    res.status(200).send({success:'true',message:'subscription package was expired',data})}
                    }else{
                        res.status(401).send({success:'false',message:'Does not track your order id'})}
                     }else{
                        const data=await interestBuyer.aggregate([{$match:{"interest":true}},{$unwind:{path:"$propertyDetails"}},{$unwind:{path:"$userDetails"}},{$match:{$and:[{'propertyDetails.propertyOwnerId':(userToken.id)},{"propertyDetails.deleteFlag":false}]}},{$match:{"userDetails.deleteFlag":false}},{$limit:2}])

                            res.status(200).send({success:'true',message:'fetch data successfully',data})}
                    }else{
                        res.status(400).send({success:'false',message:'invalid token'})}
                     }else{
                         res.status(400).send({success:'false',message:'unauthorized'})}
    } catch (err) {
        res.status(500).send({message:'internal server error'})
    }
}

exports.getSingleBuyerInterestList =async(req, res) => {
    try {
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            if(token){
                if(req.params.userId){

                    const data=await interestBuyer.aggregate([{$match:{"interest":true}},{$match:{"userDetails.deleteFlag":false}},{$unwind:{path:"$userDetails"}},{$match:{$and:[{"userDetails._id":new mongoose.Types.ObjectId(req.params.userId)},{"userDetails.deleteFlag":false}]}},{$project:{userDetails:1}}])
                    
                    res.status(200).send({success:'true',message:'fetch data successfully',data})

                }else{
                    res.status(401).send({success:'false',message:'params is required',data:[]})
                }
            }else{
                res.status(400).send({success:'false',message:'invalid token',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
        
    } catch (err) {
        res.status(500).send({message:'internal server error'})
    }
}

