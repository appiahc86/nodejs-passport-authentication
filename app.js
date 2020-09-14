import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';

const __dirname = path.resolve();

const app = express();

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