const mongoose = require('mongoose')

const prob_sugg_ques_feedbackSchema = mongoose.Schema({
    name: String,
    email:String,
    message: String,
    deleteFlag:{
        type:String,
        default:false
    }
})

const  problemAndSuggestion= mongoose.model("prob_sugg_ques_feedbackSchema", prob_sugg_ques_feedbackSchema)

module.exports = { problemAndSuggestion }