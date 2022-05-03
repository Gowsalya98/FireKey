
const {problemAndSuggestion}= require('./prob_sugg_ques_fb_model')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')

exports.createProbAndSuggAndQuesAndFb = async (req, res) => {
    try {
        const data=await problemAndSuggestion.create(req.body)
        if(data){
            res.status(200).send({success:'true',message:'successfully send details',data:data})
        }else{
            res.status(302).send({success:'false',message:'something wrong data does not send'})
        }
    } catch (err) {
         res.status(500).send({message:'internal server error'})
    }
}
exports.getAllProbAndSuggAndQuesAndFbList = async(req, res) => {
    try {
        if(req.headers.authorization){
        const data=await problemAndSuggestion.find({})
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({ success:'true',message: "All data list", data:data })
            }else{
                res.status(302).send({ success:'false',message: "data not found", data:[] }) 
            }
        }else{
            res.status(400).send({ success:'false',message: "unauthorized" })
        }
           
    } catch (err) {
         res.status(500).send({message:'internal server error'})
    }
}

exports.getSingleProbAndSuggAndQuesAndFbList=async(req,res)=>{
    try{
        if(req.params.problemAndSuggestionId==24){
            const data=await problemAndSuggestion.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.problemAndSuggestionId)}}])
            if(data){
                res.status(200).send({ success:'true',message: "your data", data:data })
            }else{
                res.status(302).send({ success:'false',message: "data not found", data:[] }) 
            }
        }else{
            res.status(400).send({ success:'false',message: "invalid id" })
        }
    }catch(err){
         res.status(500).send({message:'internal server error'})
    }
}

