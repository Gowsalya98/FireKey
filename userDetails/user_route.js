
const router = require('express').Router()

const {registerForUser,verificationMailForUser,userLogin,forgetPassword,getAllUserList,getSingleUser,updateUserProfile,deleteUserProfile,searchPropertyForBuyer} = require('./user_controller')
const keeyValidation = require('../middleware/validation')



router.post('/register', keeyValidation.validation,registerForUser)
router.post('/verificationMailForUser/:id/:buyerId',verificationMailForUser)

router.post('/login', keeyValidation.validation,userLogin)
router.post('/forgetPassword',keeyValidation.validation,forgetPassword)

router.get('/getAllUserList',getAllUserList)
router.get('/getSingleUser/:userId',getSingleUser)

router.put('/updateUserProfile',updateUserProfile)
router.delete('/deleteUserProfile',deleteUserProfile)

router.get('/searchPropertyForBuyer/:key',searchPropertyForBuyer)

module.exports = router