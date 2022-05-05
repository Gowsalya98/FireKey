
const router = require('express').Router()

const {register,login,forgetPassword,getAllUserList,getSingleUser,
    updateUserProfile,deleteUserProfile,searchPropertyForBuyer} = require('./user_controller')

const validation = require('../middleware/validation')

router.post('/register', validation.validation,register)

router.post('/login', validation.validation,login)
router.post('/forgetPassword',validation.validation,forgetPassword)

router.get('/getAllList',getAllUserList)
router.get('/getSingleDetails/:userId',getSingleUser)

router.put('/updateProfile/:userId',updateUserProfile)
router.delete('/deleteProfile/:userId',deleteUserProfile)

router.get('/searchPropertyForBuyer',searchPropertyForBuyer)

module.exports = router