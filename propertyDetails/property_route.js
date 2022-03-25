const router = require('express').Router()
const propertyController = require('./addProperty_controller')
// const keeyValidation = require('../middleware/validation')
const sellerMulter = require('../middleware/multer')

router.post('/addProperty', sellerMulter.upload.single('landImage'), propertyController.addProperty)
router.get('/sellerGetOwnPropertyList', propertyController.sellerGetOwnPropertyList)

router.get('/getAllPropertyList',propertyController.getAllPropertyList)
router.get('/selectedPropertyList/:typeOfLand',propertyController.selectedPropertyList)
router.get('/sellorRentOrLease/:sellOrRentOrLease',propertyController.sellOrRent)

router.get('/getSellerList', propertyController.getSellerList)
router.get('/getSinglePropertyData/:id', propertyController.getSinglePropertyData)

router.put('/updateProperty/:id', propertyController.updateProperty)
router.delete('/deleteProperty/:id', propertyController.deleteProperty)

router.get('/recentPost/:totalNoOfDays',propertyController.dateForRecentlyPost)

module.exports = router