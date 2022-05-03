const router = require('express').Router()
const problemControl = require('./prob_sugg_ques_fb_controller')

router.post('/createProbAndSuggAndQuesAndFb',problemControl.createProbAndSuggAndQuesAndFb)

router.get('/getAllProbAndSuggAndQuesAndFbList',problemControl.getAllProbAndSuggAndQuesAndFbList)

router.get('/getSingleProbAndSuggAndQuesAndFb/:problemAndSuggestionId',problemControl.getSingleProbAndSuggAndQuesAndFbList)


module.exports = router