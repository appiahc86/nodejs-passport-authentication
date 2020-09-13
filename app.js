import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';
import expressLayouts from 'express-ejs-layouts';

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

//body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//set view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//load routes
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
app.use('/', indexRouter);
app.use('/users', usersRouter);



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});