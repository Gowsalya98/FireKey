const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const app = express()

const superAdmin=require('./superAdmin/superAdmin_route')
const user=require('./userDetails/user_route')
const property=require('./propertyDetails/property_route')
const interestBuyer=require('./interestBuyer/interest_route')
const payment=require('./paymentDetails/payment_route')
const problemAndSuggestion=require('./prob_sugg_ques-fb/prob_sugg_ques_fb_route')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/uploads', express.static('/home/fbnode/NODE_GOWSI/uploads/firekey'))

app.use('/admin',superAdmin)
app.use('/user',user)
app.use('/property',property)
app.use('/user/interest',interestBuyer)
app.use('/payment',payment)
app.use('/admin/problemAndSuggestion',problemAndSuggestion)

app.get('/',(req,res)=>{
    res.send('welcome FireKey')
})

app.listen(process.env.PORT, () => {
    console.log("port running on ", process.env.PORT)
})

