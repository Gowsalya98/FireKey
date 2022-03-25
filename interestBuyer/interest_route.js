const router = require('express').Router()
const {interestBuyer,getAllInterestList,getSingleBuyerInterestList}= require('./interest_controller')

router.get('/interestBuyer/:userId/:propertyId', interestBuyer)

router.get('/getAllInterestList', getAllInterestList)
router.get('/getSingleBuyerInterestList/:id',getSingleBuyerInterestList)


module.exports = router