
const router = require('express').Router()

const {getPackagePaymentList,createOrderId,getAllPaymentList,getSingleSellerPaymentList,paymentDetails} = require('./payment_controller')

router.get('/getPackagePaymentList', getPackagePaymentList)

router.post('/createOrderId',createOrderId)
router.post('/paymentDetails', paymentDetails)

router.get('/getAllPaymentList', getAllPaymentList)
router.get('/getSingleSellerPaymentList/:id', getSingleSellerPaymentList)

module.exports = router