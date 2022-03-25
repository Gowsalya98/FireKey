const router = require('express').Router()
const {reportSellerProperty,getAllReportList,getSingleReport,userDeleteOurOwnReportData} = require('./report_Controller')
const reportMulter = require('../middleware/multer')

router.post('/reportSellerProperty/:userId/:propertyId', reportMulter.upload.single('reportImage'),reportSellerProperty)

router.get('/getAllReportList',getAllReportList)
router.get('/getSingleReportData/:id',getSingleReport)

router.delete('/userDeleteOurOwnReportData/:id',userDeleteOurOwnReportData)

module.exports = router