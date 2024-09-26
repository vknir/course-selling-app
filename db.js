const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const z =require('zod');

require('dotenv').config()






const ObjectId = mongoose.ObjectId


const userSchema = new mongoose.Schema({
    
    firstName : String,
    lastName : String,
    email: {
        type: String,
        unique:true
    },
    password : String
})


const adminSchema = new mongoose.Schema({   
  
    firstName : String,
    lastName : String,
    email: {
        type:String,
        unique:true,
    },
    password : String
})

const  courseSchema = new mongoose.Schema({
    
    creatorID: ObjectId,
    description:String,
    title:String
})

const purchaseSchema = new mongoose.Schema({
    userID:ObjectId,
    courseID:ObjectId,
    
})

const userModel = mongoose.model('user', userSchema);
const adminModel = mongoose.model('admin', adminSchema);
const courseModel = mongoose.model('course', courseSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);


module.exports={
    userModel,
    purchaseModel,
    courseModel,
    adminModel
}