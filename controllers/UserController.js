import Validator from 'validatorjs';
import User from "../models/User.js";

const UserController = {

    login: (req, res) => {
        res.render('login');
    },

    registerationForm: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {

       // const {name, email, password, password_confirmation} = req.body;

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

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                newUser.save().then(saved =>{
                    //Redirect to Login Page
                   return  res.redirect('login')
                }).catch(err => {
                    return res.send('could not save user');
                })


            });


        }




    }


}

export default UserController;