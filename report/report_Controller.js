
const {reportProperty}= require('./report_model')
const {property} = require('../propertyDetails/property_model')
const {register}=require('../userDetails/user_model')
const jwt=require('jsonwebtoken')

exports.reportSellerProperty = async (req, res) => {
    try {
        register.findOne({_id:req.params.userId,deleteFlag:"false"},(err,data)=>{
            if(data){
                console.log('line 10',data)
                req.body.userData=data
                property.findOne({_id:req.params.propertyId,deleteFlag:"false"},async(err,datas)=>{
                    if(datas){
                        console.log('line 14',datas)
                        req.body.propertyData=datas
                            
                             if (req.file == null || undefined) {
                            req.body.reportImage = " "
                            } else {
                                req.body.reportImage = `http://192.168.0.112:8040/uploads/${req.file.filename}`
                                }
                        await reportProperty.create(req.body, (err, result) => {
                            if (err) {res.status(400).send('already you report this land')}
                            console.log('line 24',result)   
                            res.status(200).send({ message: 'report successfully added',result})
                        })
                    }else{
                        res.status(400).send('Invalid Authentication')
                    }
                })
            }else{
                res.status(400).send('Invalid Authentication')
            }
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}
exports.getAllReportList =  (req, res) => {
    try {
        reportProperty.find({deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 44',data)
            res.status(200).send({ message: "ReportList", data })
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

exports.getSingleReport=(req,res)=>{
    try{
        console.log('line 52',req.params.id)
        reportProperty.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 55',data)
            res.status(200).send({ message: "ReportDetails", data })
        })
    }catch(err){
        res.status(400).send({ message: err.message })
    }
}

exports.userDeleteOurOwnReportData=(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userid
        register.find({_id:id,deleteFlag:"false"},(err,datas)=>{
            if(datas){
                reportProperty.findOne({_id:req.params.id,deleteFlag:"false"},(err,result)=>{
                    if(err)throw err
                    reportProperty.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:'true'}},{returnOriginal:'false'},(err,data)=>{
                        if(err)throw err
                        console.log('line 75',data)
                        res.status(200).send({message:'successfully deleted your data',data})
                    })
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
