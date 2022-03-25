
const router = require('express').Router()

const {superAdminRegister,superAdminLogin,getAllPropertyList} = require('./superAdmin_controller')

const keeyValidation = require('../middleware/validation')


router.post('/superAdminRegister', keeyValidation.validation,superAdminRegister)
router.post('/superAdminLogin', keeyValidation.validation,superAdminLogin)

router.get('/getAllPropertyList',getAllPropertyList)


module.exports = router