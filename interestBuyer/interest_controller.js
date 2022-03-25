
const {interestBuyer} = require('./interest_model')
const {property} = require('../propertyDetails/property_model')
const {register}=require('../userDetails/user_model')
const nodemailer = require('nodemailer')

exports.interestBuyer = async (req, res) => {
    try {
        register.findOne({_id:req.params.userId,deleteFlag:"false"},(err,data)=>{
            if(data){
                console.log('line 24',data)
                req.body.userData=data
                property.findOne({_id:req.params.propertyId,deleteFlag:"false"},async(err,datas)=>{
                    if(datas){
                        console.log('line 27',datas)
                        req.body.propertyData=datas
                        await interestBuyer.create(req.body, (err, result) => {
                            if (err) throw err
                            postMail(datas.email, 'Firekey Site','SomeOne Like Your Site' )
                            console.log('line 30',result)   
                            res.status(200).send({ message: "Interest Buyer send email successfully",result})
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
        res.status(500).send(err.message)
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

exports.getAllInterestList =  (req, res) => {
    try {
       interestBuyer.find({deleteFlag:'false'},(err,data)=>{
           if(err)throw err
           console.log('line 57',data)
           res.status(200).send(data) 
       })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

}
exports.getSingleBuyerInterestList =(req, res) => {
    try {
        interestBuyer.findOne({ _id: req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 69',data)
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}
// const currentInterestList = async (req, res) => {

//     // var myDate = new Date(1644305776210 );
//     // console.log(myDate.toLocaleString());
//     interestControll.interestBuyerSchema.find({}, { dateTime: 1, _id: 0 }, (err, data) => {
//         if (err) throw err
//         console.log(data)
//         res.status(200).json(data)
//         let day = (data[1].dateTime)

//         // var day = dateTime.getDate();
//         // day = (day < 10 ? "0" : "") + day;
//         console.log(typeof (day))
//         console.log(typeof (new Date()))
//     })
// }

