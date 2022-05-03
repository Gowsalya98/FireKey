
const {payment,transaction} = require('./payment_model')
const{register}=require('../userDetails/user_model')
const mongoose=require('mongoose')
const moment=require('moment')
const razorpay=require('razorpay')
const jwt = require('jsonwebtoken')


exports.createOrderId=async(req,res)=>{

    var instance = new razorpay({ 
        key_id: 'rzp_test_GUxQPzcyYr9u9P', 
        key_secret: 'L33CkDSL2wI8qOHhIQRnZOoF' 
    })

  var options = {
    amount: 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    if(err){
        res.status(400).send({success:'false',message:'failed'})
    }else{
        req.body.paymentId = order.id
      payment.create(req.body, (err, data) => {
        if (err) { res.status(400).send({ success: 'false', message: 'failed'}) }
        else { res.status(200).send({ success: 'true', message: 'successfully generated orderId', data }) }
      })
    }
  });
}

exports.viewPackageAndPaidPaymentForPropertyOwner = async (req, res) => {
    try {
        const alreadyExists=await transaction.aggregate([{$match:{"ownerId":req.params.ownerId}}])
        if(alreadyExists.length!=0){
    
          const ownerData=await register.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.ownerId)}}])
          
          const oldDate=new Date(ownerData[0].subscriptionEndDate)
          const currentDate=new Date()
          const differInDays=moment(oldDate).diff(moment(currentDate),'days')
    
          if(req.body.subscriptionPlan=='1 month'){
           
            req.body.validityDays=30+differInDays
            req.body.subscriptionEndDate=moment(new Date()).add(30+differInDays,'days').toISOString()
              }
          if(req.body.subscriptionPlan=='3 month'){
            req.body.validityDays=60+differInDays
            req.body.subscriptionEndDate=moment(new Date()).add(90+differInDays,'days').toISOString()
              }
          if(req.body.subscriptionPlan=='6 month'){
              req.body.validityDays=180+differInDays
              req.body.subscriptionEndDate=moment(new Date()).add(180+differInDays,'days').toISOString()
              }
          if(req.body.subscriptionPlan=='1 year'){
                req.body.validityDays=360+differInDays
                req.body.subscriptionEndDate=moment(new Date()).add(360+differInDays,'days').toISOString()
              }
              req.body.ownerId=req.params.ownerId
              const createPaymentAgain=await transaction.create(req.body)
    
        } 
    
        else{
            req.body.ownerId=req.params.ownerId
          const paymentCreated=await transaction.create(req.body)
          console.log('line 73',paymentCreated)
    
          if(paymentCreated.subscriptionPlan=='1 month'){
            req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(30,'days').toISOString()
            console.log('line 77',req.body.subscriptionEndDate)
            req.body.validityDays=30
              }
    
          if(paymentCreated.subscriptionPlan=='3 month'){
            req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(90,'days').toISOString()
            req.body.validityDays=60
              }
    
          if(paymentCreated.subscriptionPlan=='6 month'){
              req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(180,'days').toISOString()
            req.body.validityDays=180
              }
    
          if(paymentCreated.subscriptionPlan=='1 year'){
              req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(360,'days').toISOString()
                req.body.validityDays=360
              }
              
            req.body.subscriptionStartDate=paymentCreated.createdAt
            req.body.paymentId=paymentCreated.paymentId
            req.body.paymentStatus='paid'
        
      }
    
        const userUpdate = await register.findByIdAndUpdate(req.params.ownerId, req.body, { new: true })
    
        res.status(200).send({success:'true',message:'payment created successfully'})
    
      } catch(err){
        res.status(500).send({message:'internal server error'})
    
      } 
           
    }


exports.getAllPaymentList = async (req, res) => {
    try {
       const adminToken=jwt.decode(req.headers.authorization)
       if(adminToken!=undefined){
            const data=await transaction.find({})
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All payment list',data})
       }else{
           res.status(400).send({success:'false',message:'unauthorized',data:[]})
       }
    } catch (err) {
        res.status(500).send({ message:'internal server error'})
    }

}

exports.getSinglePaymentDetails = async (req, res) => {
    try {
       if(req.params.transactionId.length==24){
    const data=await transaction.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.transactionId)}}])
        if(data!=null){
            res.status(200).send({success:'true',message:'your data',data:data})
        }else{
            res.status(302).send({success:'false',message:'failed',data:[]})
        }
       }
       //res.status(400).send({success:'false',message:'please provide valid id'})    
    } catch (err) {
      console.log(err);
        res.status(500).send({ message: 'internal server error' })
    }
}



