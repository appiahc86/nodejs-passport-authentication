import Validator from 'validatorjs';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import User from "../models/User.js";

import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;


//Passport auth
passport.use(
    new LocalStrategy({usernameField: 'email', }, (email, password, done) =>{
        //Match User
        User.findOne({email: email})
            .then(user => {
                if (!user){
                    return done(null, false, {message: 'Email not found'})
                }
                //Match Passwords
                bcrypt.compare(password, user.password, (err, isMatched) => {
                    if (err) throw err;

                    if (isMatched){
                        return done(null, user);
                    }else {
                        return done(null, false, {message: 'Incorrect Password'})
                    }
                });


            })
            .catch(err => console.log(err))

    })
);



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});  // End of passport config







const UserController = {

    showLoginForm: (req, res) => {
      res.render('login');
    },

    login: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
        })(req, res, next);

    },

    logout: (req, res)=>{
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login')
    },

    registerationForm: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {

       //Validate requests
        const validation = new Validator(
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                password_confirmation: req.body.password_confirmation
            },
        {
            name: ['required', 'string', 'min:4', 'max:255'],
            email: ['required', 'email'],
            password: ['required', 'min:6', 'confirmed']
        }
        );
    // If validation fails

        if (validation.fails()){
            //get errors
            const errname = validation.errors.get('name');
            const erremail = validation.errors.get('email');
            const errpassword = validation.errors.get('password');
            //get form data
            let {name, email, password} = req.body;
           return  res.render('register', {errname, erremail, errpassword, name, email, password} );
        }


        //Validation pass
        //Check if email exists
        const emailExists = await User.findOne({email: req.body.email})

        if (emailExists) {
            const {name, email, password} = req.body;
            let erremail = 'This email already exists';
            return res.render('register', {name, email, password, erremail} );
        } else  //If Email does not exist...
        {

            //save new user
            await validation.passes(()=> {



                //Hash Password
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });

                        newUser.save().then(saved =>{
                            //Redirect to Login Page
                            req.flash('success_msg', 'Registration successful, you may login now')
                            return  res.redirect('login')
                        }).catch(err => {
                            return res.send('could not save user');
                        });

                    });
                }); // ./bcrypt

            }); // ./validation passes


        }




    } // ./register Async


}

export default UserController;