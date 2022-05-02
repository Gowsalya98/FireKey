const router = require('express').Router()
const propertyController = require('./addProperty_controller')
const multer = require('../middleware/multer')

router.post('/addProperty', propertyController.addProperty)

router.post('/propertyImage',multer.upload.single('propertyImage'),propertyController.propertyImage)

router.get('/sellerGetOwnPropertyList', propertyController.sellerGetOwnPropertyList)

router.get('/getAllPropertyList',propertyController.getAllPropertyList)

router.get('/getSinglePropertyData/:propertyId', propertyController.getSinglePropertyData)

router.put('/updateProperty/:propertyId', propertyController.updateProperty)

router.delete('/deleteProperty/:propertyId', propertyController.deleteProperty)

//filter
router.get('/selectedPropertyList/:typeOfLand',propertyController.selectedPropertyList)
router.get('/recentPost/:totalNoOfDays',propertyController.dateForRecentlyPost)
router.get('/sellorRentOrLease/:sellOrRentOrLease',propertyController.sellOrRent)

module.exports = router