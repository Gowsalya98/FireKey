const mongoose=require('mongoose')
const {register} = require('../userDetails/user_model')
const{superadmin}=require('../superAdmin/superAdmin_models')
const {property,image} = require('./property_model')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')


const addProperty = async (req, res) => {
    try {
        const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.json({message:errors.array()})
    }else{
        if(req.headers.authorization){
            const token=await jwt.decode((req.headers.authorization))
            req.body.propertyOwnerId=token.id
          //  req.body.propertyStatus=req.params.label
            property.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                      console.log(data)
                        res.status(200).send({success:'true',message:'create successfully',data})
                    }else{
                      res.status(200).send({success:'false',message:'failed',data:[]})
                    }
                }
            })
            }else{
                res.status(200).send({success:'false',message:'unauthorized'})
            }
    }
    } catch (err) {
        res.status(500).send({ message: 'internal server error' })
    }
}
const propertyImage=async(req,res)=>{
    try{
      req.body.propertyImage=`http://192.168.0.112:8040/uploads/${req.file.originalname}`
      image.create(req.body,async(err,data)=>{
        if(err){
          res.status(400).send({success:'false',message:'failed'})
        }else{
          res.status(200).send({success:'true',message:'property image created successfully',data})
        }
      })
    }catch(err){
      res.status(500).send({message:'internal server error'})
    }
  }

const sellerGetOwnPropertyList = async (req, res) => {
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        if(ownerToken!=undefined){
            const data=await property.aggregate([{$match:{propertyOwnerId:ownerToken.id}}])
            const arr=[]
            if(data.length!=0){
                const datas=data.map((result)=>{
                    result.deleteFlag=='false'
                    return arr.push(result)
                })
                arr.sort().reverse()
                res.status(200).send({success:'true',message:'your own property',data: arr });
      } else {
        res.status(302).send({success:'false',message:'failed',data: [] });
      }
    } else {
      res.status(400).send("unauthorized");
    }
  } catch (err) {
      console.log(err);
    res.status(500).send({message:"internal server error"});
  }
}

const getAllPropertyList=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=undefined){
            console.log('line 83',adminToken.id);
            const data=await property.aggregate([{$match:{deleteFlag:false}}])
                data.sort().reverse()
                res.status(200).send({success:'true',message:'All property list',data: data });
      } else {
        res.status(302).send({success:'false',message:'unauthorized',data: [] });
      }
    }catch (err) {
        res.status(500).send({ message:"internal server error" })
    }
}

const getSinglePropertyData = async (req, res) => {
    try {
        if(req.params.propertyId.length==24){
            const data=await property.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.propertyId)},{"deleteFlag":false}]}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'your data' ,data: data });
            } else {
              res.status(302).send({success:'false',message:'failed', data: [] });
            }
          } else {
            res.status(400).send({ message: "please provide a valid id" });
          }

    } catch (err) {
        res.status(500).send({ message:"internal server error" })
    }
}

const updateProperty = async (req, res) => {
    try{
        if(req.headers.authorization){
          if (req.params.propertyId.length == 24) {
          let datas = await property.findByIdAndUpdate(req.params.propertyId,{$set:req.body},{new:true})
            if (datas) {
                  res.status(200).send({ success:'true',message:'upadate successfully',data: datas });
              }else{
                res.status(400).send({ success:'false',message:'failed',data: [] });
              }       
          } else {
            res.status(302).send({ message: "please provide a valid property id" });
          }
        }else{
          res.status(400).send({ message: "unauthorized" });
        }
      }catch(err){
          console.log(err)
        res.status(500).send("internal server error")
      }
}

const deleteProperty = async (req, res) => {
    try {
        if (req.params.propertyId.length == 24) {
            let datas = await property.findByIdAndUpdate(req.params.propertyId,{deleteFlag:true},{returnOriginal:false})
              if (datas!=null) {
                    res.status(200).send({ success:'true',message:'delete data successfully',data: datas });
                }else{
                  res.status(400).send({ success:'false',message:'failed',data: [] });
                }       
            } else {
              res.status(302).send({ message: "please provide a valid property id" });
            }
        }catch(err){
            console.log(err)
          res.status(500).send("internal server error")
        }
  }

  const propertyTypeFilter=async(req,res)=>{
    try{        
                console.log('line99',req.params.propertyType)
                    if(req.params.propertyType=='residential'){
                      const data=await property.aggregate([{$match:{$and:[{"propertyType":req.params.propertyType},{"deleteFlag":false}]}}])
                            if(data){
                                res.status(200).send({success:'true',message:'your property list',data:data})
                                }else{
                                    res.status(400).send({success:'false',message:'data not found',data:[]})
                                }
                    }else if(req.params.propertyType=='commerical'){
                      const data=await property.aggregate([{$match:{$and:[{"propertyType":req.params.propertyType},{"deleteFlag":false}]}}])
                      if(data){
                          res.status(200).send({success:'true',message:'your property list',data:data})
                          }else{
                              res.status(400).send({success:'false',message:'data not found',data:[]})
                          }
                    }else{
                      const data=await property.aggregate([{$match:{$and:[{"propertyType":req.params.propertyType},{"deleteFlag":false}]}}])
                      if(data){
                          res.status(200).send({success:'true',message:'your property list',data:data})
                          }else{
                              res.status(400).send({success:'false',message:'data not found',data:[]})
                          }
                        }
    }catch(err){
        res.status(500).send({message:"internal server error"})}
}

const propertyStatusFilter=async(req,res)=>{
    try{
        console.log('line 143',req.params.propertyStatus)
        if(req.params.propertyStatus=='sell'){
          const data=await property.aggregate([{$match:{$and:[{"propertyStatus":req.params.propertyStatus},{"deleteFlag":false}]}}])
          if(data){
              res.status(200).send({success:'true',message:'your property list',data:data})
              }else{
                  res.status(400).send({success:'false',message:'data not found',data:[]})
              }
        }else if(req.params.propertyStatus=='rent'){
          const data=await property.aggregate([{$match:{$and:[{"propertyStatus":req.params.propertyStatus},{"deleteFlag":false}]}}])
          if(data){
              res.status(200).send({success:'true',message:'your property list',data:data})
              }else{
                  res.status(400).send({success:'false',message:'data not found',data:[]})
              }
        }else{
          const data=await property.aggregate([{$match:{$and:[{"propertyStatus":req.params.propertyStatus},{"deleteFlag":false}]}}])
          if(data){
              res.status(200).send({success:'true',message:'your property list',data:data})
              }else{
                  res.status(400).send({success:'false',message:'data not found',data:[]})
              }
        }
    }catch(err){
        res.status(500).send({message:"internal server error"})
    }
}
const dateForRecentlyPost=(req,res)=>{
    try{
        console.log('line 226',req.params.totalNoOfDays)
        property.find({},async(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 150',data)
                const y=new Date().toISOString()
                console.log('current',typeof(y),y)
                const z= new Date()
                z.setDate(z.getDate()-req.params.totalNoOfDays)
                // const o = new Date().setDate(z.getDate)
                const k=z.toISOString()
                console.log('next',typeof(k))
                // console.log(k.substring(0,10))
                // console.log(y.substring(0,10))
                // for (var i=0;i<=data.length;i++){

                // }
                const a= await property.aggregate([{$match:{createdAt:{$gte:k,$lt:y}}}])
                // ,{$match:{createdAt:{$gte:k.substring(0,10),$lt:y.substring(0,10)}}}])
            //   const xx=await register.find({
            //         createdAt: {
            //             $gte: k.substring(0,10),
            //             $lt: y.substring(0,10)
            //         }
            //     })
                // console.log(xx)
                res.status(200).send(a)
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

    
module.exports = {
    addProperty, 
    propertyImage,
    sellerGetOwnPropertyList,
    getAllPropertyList,
    getSinglePropertyData,
    updateProperty, 
    deleteProperty,
    propertyTypeFilter,
    propertyStatusFilter,
    dateForRecentlyPost,
}