
const router = require('express').Router()

const {createOrderId,viewPackageAndPaidPaymentForPropertyOwner,getAllPaymentList,getSinglePaymentDetails} = require('./payment_controller')

router.post('/createOrderId',createOrderId)

router.post('/paymentDetails/:ownerId',viewPackageAndPaidPaymentForPropertyOwner )

router.get('/getAllPaymentList', getAllPaymentList)

router.get('/getSinglePaymentDetails/:transactionId',getSinglePaymentDetails )

module.exports = router