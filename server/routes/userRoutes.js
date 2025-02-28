const express = require('express')
const { signupController, signinController, updateUserController, requireSignIn , leaderboardController  } = require('../controllers/userController')

//router object
const router = express.Router()

//route
//signup || post
router.post('/signup',signupController)

//signin || post
router.post('/signin' , signinController)

//update || put
router.put('/update-user', requireSignIn  , updateUserController)

router.get("/leaderboard", leaderboardController);


//export
module.exports = router
