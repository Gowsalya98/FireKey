
const router = require('express').Router()

const {registerForUser,verificationMailForUser,userLogin,forgetPassword,getAllUserList,getSingleUser,updateUserProfile,deleteUserProfile,searchPropertyForBuyer} = require('./user_controller')
const keeyValidation = require('../middleware/validation')
//const sellerMulter = require('../middleware/multer')


router.post('/userRegister', keeyValidation.validation,registerForUser)
router.post('/verificationMailForUser/:id/:buyerId',verificationMailForUser)

router.post('/userLogin', keeyValidation.validation,userLogin)
router.post('/forgetPassword',keeyValidation.validation,forgetPassword)

router.get('/getAllUserList',getAllUserList)
router.get('/getSingleUser',getSingleUser)

router.put('/updateUserProfile',updateUserProfile)
router.delete('/deleteUserProfile',deleteUserProfile)

router.get('/searchPropertyForBuyer/:key',searchPropertyForBuyer)

module.exports = router