const express = require('express')
const courseRouter = express.Router()

const {courseModel} =require('../db')

courseRouter.get("/preview", async (req,res)=>{
    
    try{
        const courses= await courseModel.find();
        
        res.json({
            courses
        })
    }catch(err){
        console.log(err)
        res.json({message: "Error while fetching courses, try again"})
    }
})



module.exports = courseRouter