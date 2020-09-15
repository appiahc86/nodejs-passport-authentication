import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';

const __dirname = path.resolve();

const app = express();


//Dotenv
dotenv.config();

const port = process.env.PORT || 5000;

//body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//database connection
mongoose.Promise = global.Promise;
//Database Connection
mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
)
    .then(db =>  console.log('Database Connected'))
    .catch(error => console.log(error));

//Session
app.use(session({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//set view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))


//load routes
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
app.use('/', indexRouter);
app.use('/users', usersRouter);



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});