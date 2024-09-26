const express = require('express')
const userRouter = express.Router()
const  jwt= require('jsonwebtoken');

const bcrypt=require('bcrypt');
const {z} = require('zod')

const {userModel, purchaseModel} =require('../db');
const { JWT_USER_SECRET } = require('../config');
const {userAuth} =require('../middlewares/userAuth');
const { default: mongoose } = require('mongoose');







userRouter.post('/signup',async (req,res)=>{

    // createing user's credentails validator
    const userValidation = z.object({
        email: z.string().email(),
        firstName: z.string(),
        lastName:z.string(),
        password:z.string()
    })

    // hashing the password
    
        const password = await bcrypt.hash(req.body.password, 3);
         
        
        // creating json of newUser
        const  newUser= {
                email:req.body.email,
                password:password,
                firstName:req.body.firstName,
                lastName:req.body.lastName
        }

    
   
    
             
        // validating the new user
    
       const isValidated= userValidation.parse(newUser)
        
       if(isValidated){

        // adding newUser to the DB
        
        try{
            await userModel.create(newUser)
            res.json({
                message:"New user added!"
            })
        }
        catch(err)
        {
            console.log(err)
            res.json({
                message:"Email in use"
            })
        }
    }
    else{
        res.json({
            message:isValidated
        })
    }
})

userRouter.post('/login', async (req,res)=>{

    const password= req.body.password;
    const email=req.body.email;

    // finding if user exists 
    const user = await userModel.findOne({ email :email});
    
    //comparing passwords
    const passwordMatch = await bcrypt.compare( password, user.password);
 

    // if all credentails match, send token
    if(user && passwordMatch)
    {
        const token = jwt.sign( {
            _id: user._id
        },JWT_USER_SECRET);

        res.json({token})
    }
    else{
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
})



userRouter.use(userAuth)

userRouter.post('/buy/:id', async (req, res)=>{
        const courseID= new mongoose.Types.ObjectId(req.params.id)
        const userID = new mongoose.Types.ObjectId(req.body.user.id);

        try{
            await purchaseModel.create({courseID,userID})
            res.json({
                message:"payment successful"
            })
        }catch(e)
        {
            console.log(e)
            res.json({message:"Error while pusrchasing"})
        }

})

userRouter.get('/purchases', async (req, res)=>{
    const userID= req.body.user._id;

    try{
        const purchases=await purchaseModel.find({userID})
        res.json({
            purchases
        })
    }
    catch(e){
        console.log(e)
        res.json({message:"Error while fetching data"})
    }

})



module.exports = userRouter