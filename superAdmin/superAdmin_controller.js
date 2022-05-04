const {superadmin,package} = require('./superAdmin_models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')


const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
           const data=await superadmin.aggregate([{ $match:{"email": req.body.email }}])
           console.log('line 14',data);
                if (data.length == 0) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    superadmin.create(req.body, (err, data) => {
                        if (err){
                            res.status(400).send({ success:'false',message:"failed"})
                        }else{
                        res.status(200).send({ message: "Successfully Registered", data })
                        }
                    })
                } else {
                    res.status(400).send({ message: "This Email already Exists" })
                }
        }
    } catch (err) {
        res.status(500).send({ message: 'internal server error' })
    }
}

const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
          const data=await superadmin.findOne({email:req.body.email})
                if (data) {
                    const password = await bcrypt.compare(req.body.password, data.password)
                    if (password == true) {
                        const userid = data._id
                        const token = jwt.sign({ userid }, 'secretKey')
                        res.status(200).send({success:'true',message: "Login Successfully", token,data:data})
                    } else {
                        res.status(400).send({success:'false',message: "Incorrect Password" })
                    }

                } else {
                    res.status(400).send({ success:'false',message: "invaild email" })
                }
        }
    } catch (err) {
        res.status(500).send({ message: 'internal server error' })
    }
}

const createPackageForSuperAdmin=async(req,res)=>{
    try{
        const datas=await superadmin.findOne({role:'superadmin'})
        if(datas){
            const data = await package.create(req.body)
        if(data){
            res.status(200).send({success:'true',message:'package created successfully',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed to create',data:[]})
        }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'}) 
        }
        
    }catch(err){
        console.log(err);
        res.status(500).send({message:'internal server error'})
    }
}

const getPackageDetails=async(req,res)=>{
    try{
        const data=await package.aggregate([{$match:{"deleteFlag":false}}])
        if(data!=null){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'All package Details',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed to get package',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const deletePackageDetails=async(req,res)=>{
    try{
    if(req.params.packageId.length==24){
        const data=await package.findOneAndUpdate({_id:req.params.packageId},{deleteFlag:'true'},{returnOriginal:false})
        if(data){
            res.status(200).send({success:'true',message:'successfully delete your package',data:data})
        }else{
            res.status(400).send({success:'false',message:'something wrong,data not found',data:[]})
        }
    }else{
        res.status(400).send({success:'false',message:'invalid id'})
    }
    
}catch(err){
    res.status(500).send({message:'internal server error'})

}
}

module.exports={register,login,createPackageForSuperAdmin,getPackageDetails,deletePackageDetails}