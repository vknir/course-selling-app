const express = require('express')
const adminRouter = express.Router()
const  jwt= require('jsonwebtoken');
const {z}= require('zod');
const bcrypt =require('bcrypt');

const {adminModel} =require('../db')
const {JWT_ADMIN_SECRET}=require('../config')
const {adminAuth} =require('../middlewares/adminAuth')
const {courseModel} = require('../db');
const { default: mongoose } = require('mongoose');

adminRouter.post('/signup', async (req,res)=>{
    
    // creating admin credentials validator 
    const adminValidation = z.object(
        {
            email: z.string().email(),
            firstName: z.string(),
            lastName: z.string(),
            password:z.string()
        }
    )

    // hashing password
    
    const password= await bcrypt.hash(req.body.password,3);
    
    // craeting new admin json
    const newAdmin= {
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:password
    }

    // validatiing new Admin json;
    try{
        adminValidation.parse(newAdmin);
        

         // adding newAdmin to the db

        await adminModel.create(newAdmin);
        res.json({
            message:" new admin signed up!"
        })
    }catch(e)
    {
        console.log(e);
        res.json({
            message:"Error signing up, please check your credentials"
        })
    }

   
    
})

adminRouter.post('/login', async (req,res)=>{
    
    const email = req.body.email;
    const password = req.body.password;

    
    
        //comparing passwords
        try{
            const admin = await adminModel.findOne({email: email,});
            
            bcrypt.compare(password, admin.password, (err, result)=>{
                if(err)
                {
                   
                    res.json({message:"Error"})
                }
                if(result){
                    console.log(result);

                    if( admin && result)
                    {
                        const token = jwt.sign( { _id: admin._id},JWT_ADMIN_SECRET)
                        res.json({token});
                    }
                    
                    else{
                        res.json({message:"Invalid creds"})
                    }
                }
                else{
                    
                    res.json({message:"Invalid creds"})
                }
            })
        }
        catch(e)
        {
            console.log(e)
            res.json({
                message:"invalid cred"
            })
        }   
    
    
    

})



adminRouter.use(adminAuth);

adminRouter.get('/all',async (req, res)=>{

    // using admin._id as creatorID to get all courses by a admin 
    try{
        // .exec() is used to execute query to get all desired data
       const  result= await courseModel.find({ creatorID : req.body.admin._id}).exec()
        res.json({
            result
        })
    }
    catch(err){
        res.json({message:"Sorry, Trouble fetching details"})
    }
})

adminRouter.post('/create', async (req, res)=>{
    const { description , title}= req.body;
    
    //creating a cousrse credential validator

    const courseValidator = z.object({
       
        description:z.string(),
        title:z.string()
    })

    // adding all course info in newCourse
    const creatorID=req.body.admin._id;
    
    
    try{
        courseValidator.parse({
            description,
            title
        })

        await courseModel.create({
            creatorID,
            description,
            title
        })

        res.json({
            message:"New Course added successfully!"
        })
    }catch(e)
    {
        console.log(e)
        res.json({
            message:"Not a valid course"
        })
    }
})

adminRouter.put('/update/:id', async(req, res)=>{
    const {title, description}=  req.body;

    //creating filter to find correct course
    const filter= {
        _id: new mongoose.Types.ObjectId(req.params.id),
        creatorID: new mongoose.Types.ObjectId(req.body.admin._id)
    }

    //all the new edits to title and description
    const update = {
        title,
        description
    }
    try{
        const response = await courseModel.findOneAndUpdate(filter,update )

        const newRes= await courseModel.findOne(filter);
        console.log(newRes)
        res.json({
            message:"DB updated"
    })
    }
    catch(err){
        res.json({message:'Error while updating DB'})
    }
})


adminRouter.delete('/delete/:id', async (req, res)=>{
    
    const {title, description} = req.body

    // a filter to find correct course
    const filter={
        _id: new mongoose.Types.ObjectId(req.params.id)
    }

    try{
        //deleting course 
        await courseModel.findOneAndDelete(filter);
        res.json({message:"Course deleted"})
    }catch(e)
    {
        res.json({message:"Unable to delete, try again in some time"})
    }

})



module.exports = adminRouter