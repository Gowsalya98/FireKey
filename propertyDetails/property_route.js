const router = require('express').Router()
const propertyController = require('./addProperty_controller')
const validation=require('./property_model')
const multer = require('../middleware/multer')

router.post('/addProperty',validation.validation, propertyController.addProperty)

router.post('/propertyImage',multer.upload.single('propertyImage'),propertyController.propertyImage)

router.get('/sellerGetOwnPropertyList', propertyController.sellerGetOwnPropertyList)

router.get('/getAllPropertyList',propertyController.getAllPropertyList)

router.get('/getSinglePropertyData/:propertyId', propertyController.getSinglePropertyData)

router.put('/updateProperty/:propertyId', propertyController.updateProperty)

router.delete('/deleteProperty/:propertyId', propertyController.deleteProperty)

//filter
router.get('/propertyTypeFilter/:propertyType',propertyController.propertyTypeFilter)

router.get('/recentPost/:totalNoOfDays',propertyController.dateForRecentlyPost)

router.get('/propertyStatusFilter/:propertyStatus',propertyController.propertyStatusFilter)

module.exports = router