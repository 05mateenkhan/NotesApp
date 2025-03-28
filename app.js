require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const methodOverride = require('method-override')
const connectDB = require('./server/config/db');
const session = require('express-session')
const passport = require('passport')
const LocaLStrategy = require('passport-local')
const mongoStore = require('connect-mongo')
const User = require('./server/models/user')
const app = express();
const port = 5000 || process.env.PORT;
const engine = require('ejs-mate');
const dbUrl = process.env.MONGODB_URI;

// app.use(passport.initialize());
// app.use(passport.session());
app.engine('ejs', engine);
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
connectDB();

app.use(express.static(path.join(__dirname, 'public')));

// app.use(expressLayouts);
// app.set('layout','./layouts/main')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs');


const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on('error', function(e) {
    console.log('Session store error',e)
})

const sessionOptions = {
    store,
    name: 'session',  
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:  {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
        // maxAge: 1
    }
}
app.use(session(sessionOptions));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocaLStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})
app.use('/', require('./server/routes/auth'))
app.use('/', require('./server/routes/index'))
app.use('/', require('./server/routes/dashboard'))
app.get('*', (req,res) => {
    res.status(404).render('404')
})
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})