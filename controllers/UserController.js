import Validator from 'validatorjs';

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

        await validation.fails((err)=> {
            const errname = validation.errors.get('name');
           return res.render('register', {errname, name: req.body.name, email: req.body.email} )
        });

        await validation.passes(()=> {

            res.send('register success')
        });


    }


}

export default UserController;