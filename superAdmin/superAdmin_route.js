
const router = require('express').Router()

const superControl = require('./superAdmin_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,superControl.register)

router.post('/login',validation.validation,superControl.login)

router.post('/createPackageForSuperAdmin',superControl.createPackageForSuperAdmin)

router.get('/getPackageDetails',superControl.getPackageDetails)

module.exports = router