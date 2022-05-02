const router = require('express').Router()
const {interestBuyer,getAllInterestBuyerList,getSingleBuyerInterestList}= require('./interest_controller')

router.post('/create/:propertyId', interestBuyer)

router.get('/getAllInterestBuyerList', getAllInterestBuyerList)
router.get('/getSingleBuyer/:userId',getSingleBuyerInterestList)


module.exports = router