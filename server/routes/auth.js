const express = require('express');
const router = express.Router();
const User = require('/MK/Development/WEBD2/Projects/NotesAppProject/server/models/user');
const passport = require('passport');

router.get('/register', (req,res) => {
    res.render('users/register');
})
router.post('/register', async(req,res) => {
    try{

        const {email, username, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user,password);
        // console.log(registeredUser)
        res.redirect('/')
    }
    catch(e){
        res.redirect('/register')
    }
})
router.get('/login', (req,res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), (req,res) => {
    res.redirect('/')
});
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}); 

module.exports = router;