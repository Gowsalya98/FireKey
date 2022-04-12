
const {payment} = require('./payment_model')
const{property} = require('../propertyDetails/property_model')
const {interestBuyer} = require('../interestBuyer/interest_model')
const razorpay=require('razorpay')
const jwt = require('jsonwebtoken')


exports.getPackagePaymentList = async (req, res) => {

    try {
        var listOfInterestSellerData = await interestBuyer.find({}).populate([{ path: 'userData', select: ['userName', 'contact'] },
        { path: 'propertyData', select: ['landDetails','agentOrOwnerName', 'areaLocation'] }])

        payment.find({ paymentId: req.body.paymentId }, (err, data) => {
            console.log(data)
            if (data != null) {
                console.log(data[0].amount)
                var pay = 5 / 100 * parseInt(data[0].amount)
                console.log('pay', pay)

                var interest = listOfInterestSellerData.length;
                console.log('interestBuyer', interest)
                // console.log(typeof(pay))
                // console.log(typeof(interest))
                const rate = interest - pay
                console.log(rate)
                //interest 20
                // pay 30
                //show = listOfInterestSellerData.slice(0,pay + 5)
                if (pay >= interest) {
                    console.log("line 27", listOfInterestSellerData)
                    res.status(200).send({ message: " line 33 Package", listOfInterestSellerData })
                    // interest 15
                    // pay 10    
                    // difference 5 small show all
                } else if (pay < interest && rate < 5) {
                    res.status(200).send({ message: "line 38 Package", listOfInterestSellerData })
                    //interest 20
                    // pay 30
                    //show = listOfInterestSellerData.slice(0,pay + 5)
                } else if (pay < interest && rate >= 5) {
                    show = listOfInterestSellerData.slice(0, pay + 5)
                    res.status(200).send({ message: " line 44 Package", show })
                }
            }
            else {
                if (listOfInterestSellerData.length >= 5) {
                    show = listOfInterestSellerData.slice(0, 5)
                    res.status(400).send({ message: "FreePackage", show })
                }else{
                    res.status(200).send({message:"FreePackage",listOfInterestSellerData})
                }
                res.status(400).send({ message: "data not found" })
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

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
    console.log(order);
    res.send(order)
  });
}

exports.paymentDetails =  (req, res) => {
    try {
        const unique = makeid(5)
        const date = Date.now().toString()
        req.body.paymentId = unique + date
        console.log(req.body.paymentId)
        req.body.paymentOn=new Date().toLocaleString()
                payment.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 14',data)
                        res.status(200).send({message:"successfully payed",data})
                    }
                })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

exports.getAllPaymentList = async (req, res) => {
    try {
        payment.find({},(err,data)=>{
            if(err)throw err
            console.log('line 96',data)
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }

}
exports.getSingleSellerPaymentList = async (req, res) => {
    try {
        payment.findById({ _id: req.params.id }, (err, data) => {
            if (err) throw err
            console.log('line 108',data)
            res.status(200).send(data)       
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}



