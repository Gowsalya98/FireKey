const { body, validationResult } = require('express-validator')

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({ min: '5', max: '10' }).withMessage('Password must be 5 Character')
]


module.exports = { validation }