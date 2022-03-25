const {register} = require('../userDetails/user_model')
const{superadmin}=require('../superAdmin/superAdmin_models')
const {property} = require('./property_model')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')


const addProperty = async (req, res) => {
    console.log('line 14',req.body)
    try {
            console.log('line 19',req.body)
            register.findOne({ email: req.body.email,deleteFlag:'false'}, async (err, data) => {
                 console.log("line 20",data)
                req.body.agentOrOwnerName = data.userName
                req.body.contact = data.contact
                const token = jwt.decode(req.headers.authorization)
                console.log("line 24",token)
                const id = token.userid
                req.body.propertyId = id
                if (data) {
                    if (req.file == undefined || null) {
                        req.body.landImage = ""
                    } else {
                        req.body.landImage = `http://192.168.0.112:8040/uploads/${req.file.filename}`
                    }
                    console.log('line 31',req.file)
                    //  console.log(typeof(req.body.landDetails))
                    var k = await JSON.parse(req.body.landDetails)
                    console.log("k",k);
                    req.body.landDetails = k
                    // JSON.parse(req.body)
                    var myDate = new Date();
                    req.body.createdAt=myDate.toISOString();
                    
                    register.findOneAndUpdate({email:req.body.email},{$set:{role:'seller'}},{new:true},(err,datas)=>{
                        if(err)throw err
                        console.log('line 32',datas)
                        property.create(req.body, (err, result) => {
                            if (err) throw err
                            console.log("line 50",result)
                            res.status(200).send({ message: "Successfully Created",result })
                           
                        })
                    })
                   
                } else {
                    res.status(400).send({ message: "This Email already Exists" })
                }
            })
        
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const sellerGetOwnPropertyList = async (req, res) => {
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userid
        property.find({propertyId:id }, (err, data) => {
            console.log('line 55',data)

            if (data[0].deleteFlag == 'false') {
                console.log(data)
                res.status(200).send({ message: data })
            } else {
                console.log('Your data is already deleted')
                res.status(400).send({ message: 'Your data is already deleted' })
            }

        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const getAllPropertyList=(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userid
        register.findOne({_id:id,deleteFlag:"false"},(err,datas)=>{
            if(datas){
        property.find({deleteFlag:'false'}, (err, data) => {
            if(err)throw err
            console.log(data)
            res.status(200).send({ message: data })
    })
    }else{
        res.status(400).send('unauthorized')
    }
        })
    }catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const selectedPropertyList=(req,res)=>{
    try{        
                console.log('line99',req.params.typeOfLand)
                    if(req.params.typeOfLand=='residential'){
                        property.find({typeOfLand:req.params.typeOfLand,deleteFlag:'false'},(err,data)=>{
                            if(data){
                                console.log('line 103',data)
                                res.status(200).send(data)
                                }else{
                                    res.status(400).send('data not found')
                                }
                        })
                    }else if(req.params.typeOfLand=='commerical'){
                        property.find({typeOfLand:req.params.typeOfLand,deleteFlag:'false'},(err,data)=>{
                            if(data){
                            console.log('line 112',data)
                            res.status(200).send(data)
                            }else{
                                res.status(400).send('data not found')
                            }
                        })
                    }else{
                        property.find({typeOfLand:req.params.typeOfLand,deleteFlag:'false'},(err,data)=>{
                            if(data){
                                console.log('line 121',data)
                                res.status(200).send(data)
                                }else{
                                    res.status(400).send('data not found')
                                }
                        })
                    }
    }catch(err){
        res.status(500).send({message:err.message})}
}

const sellOrRent=(req,res)=>{
    try{
        console.log('line 143',req.params.sellOrRentOrLease)
        if(req.params.sellOrRentOrLease=='sell'){
            property.find({sellOrRentOrLease:req.params.sellOrRentOrLease,deleteFlag:'false'},(err,data)=>{
                if(err)throw err
                console.log('line 152',data)
                res.status(200).send(data)
            })
        }else if(req.params.sellOrRentOrLease=='rent'){
            property.find({sellOrRentOrLease:req.params.sellOrRentOrLease,deleteFlag:'false'},(err,data)=>{
                if(err)throw err
                console.log('line 158',data)
                res.status(200).send(data)
            })
        }else{
            property.find({sellOrRentOrLease:req.params.sellOrRentOrLease,deleteFlag:'false'},(err,data)=>{
                if(err)throw err
                console.log('line 164',data)
                res.status(200).send(data)
            })
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getSinglePropertyData = async (req, res) => {
    try {
        console.log(req.params.id)
        property.findOne({ _id: req.params.id, deleteFlag: false }, (err, data) => {
            if (!err)
                console.log('line 80',data)
                res.status(200).send({ message: data })
        })

    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const getSellerList = async (req, res) => {
    try {
        const superAdminToken=jwt.decode(req.headers.authorization)
        const id=superAdminToken.userid
        superadmin.findOne({_id:id,deleteFlag:"false"},(err,datas)=>{
            if(datas){
        property.find({role:"seller",deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 97',data)
            res.status(200).send({message:data})
        }) 
    }else{res.status(400).send('unauthorized')}
}) 
}catch(err){
    res.status(500).send({message:err.message})
}
}

const updateProperty = async (req, res) => {
    try {
        console.log('line 106',req.params.id)
       property.find({ _id: req.params.id, deleteFlag:'false'}, (err, datas) => {
            if (err) throw err
            property.findOneAndUpdate({_id:req.params.id},req.body, {new:true}, (err, data) => {
                if(err)throw err
                res.status(200).send({ message: "Update your property details", data })
            })

        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

}

const deleteProperty = async (req, res) => {
    try {
        property.findOne({ _id: req.params.id, deleteFlag: 'false'}, (err, datas) => {
            if (err) throw err
            propertyControll.property.findOneAndUpdate({ _id: req.params.id }, { $set: { deleteFlag: "true" } }, { returnOriginal: false }, (err, data) => {
                if (!err)
                    res.status(200).send({ message: "Successfully deleted your data" })
                console.log('line 127',data)
            })
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
    addProperty, sellerGetOwnPropertyList,getAllPropertyList,selectedPropertyList,getSellerList,
    getSinglePropertyData,updateProperty, deleteProperty,dateForRecentlyPost,sellOrRent
}