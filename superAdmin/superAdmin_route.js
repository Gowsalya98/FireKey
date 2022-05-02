
const router = require('express').Router()

const {register,login} = require('./superAdmin_controller')

const validation = require('../middleware/validation')


router.post('/register', validation.validation,register)
router.post('/login',validation.validation,login)


module.exports = router