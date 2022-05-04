const { body, validationResult } = require('express-validator')

const validation = [
    body('email').isEmail().withMessage('Email must be Valid'),
    body('password').isLength({ min: '5', max: '10' }).withMessage('Password must be 5 Character'),
    body('contact').isLength({min:'10', max:'10'}).withMessage('contact number must be valid')
]

module.exports = { validation }