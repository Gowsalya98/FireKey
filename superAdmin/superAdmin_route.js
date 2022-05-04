
const router = require('express').Router()

const superControl = require('./superAdmin_controller')

const contactControl=require('./contactUs_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,superControl.register)

router.post('/login',validation.validation,superControl.login)

router.post('/createPackageForSuperAdmin',superControl.createPackageForSuperAdmin)

router.get('/getPackageDetails',superControl.getPackageDetails)

router.delete('/deletePackageDetails/:packageId',superControl.deletePackageDetails)

//contact us

router.post('/createContactUs',validation.validation,contactControl.createContactUs)

router.get('/getAllContactUsDetails',contactControl.getAllContactUsDetails)

router.get('/getSingleContactUsDetails/:id',contactControl.getSingleContactUsDetails)

module.exports = router