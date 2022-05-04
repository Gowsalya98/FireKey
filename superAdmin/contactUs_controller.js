const {contactForAdmin} = require('./superAdmin_models')
const {register}=require('../userDetails/user_model')

const mongoose=require('mongoose')

const createContactUs=async(req,res)=>{
    try{
        // const datas=await register.aggregate([{$match:{$and:[{email:req.body.email},{"deleteFlag":false}]}}])
        // if(datas){
        //     req.body.userName=datas.userName,
        //     req.body.email=datas.email,
        //     req.body.contact=datas.contact
            const data=await contactForAdmin.create(req.body)
            if(data){
                res.status(200).send({success:'true',message:'successfully send to admin',data:data})
            }else{
                res.status(400).send({success:'false',message:'failed',data:[]})
            }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const getAllContactUsDetails=async(req,res)=>{
    try{
        const data=await contactForAdmin.find({})
        if(data!=null){
            res.status(200).send({success:'true',message:'All details',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const getSingleContactUsDetails=async(req,res)=>{
    try{
        const data=await contactForAdmin.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.id)}}])
        if(data!=null){
            res.status(200).send({success:'true',message:'All details',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={createContactUs,getAllContactUsDetails,getSingleContactUsDetails}