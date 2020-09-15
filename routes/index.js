import Router from 'express';
const router = Router();

//auth middleware
import auth from "../middleware/auth.js";

router.get('/', (req, res)=>{
    res.render('welcome');
})

//dashboard
router.get('/dashboard', auth, (req, res)=>{
    res.render('dashboard', {name: req.user.name});
})




export default router;