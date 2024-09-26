const {JWT_ADMIN_SECRET} = require('../config')
const {adminModel} =require('../db')


const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')

async function adminAuth(req, res, next)
{
    const token= req.headers.token
    
    try{
        const decoded=jwt.verify(token, JWT_ADMIN_SECRET);
        
        const  mongoID= new mongoose.Types.ObjectId( decoded._id)
        const response= await adminModel.findOne({_id: (mongoID)})
        req.body.admin=response;
        next();
    }
    catch(e)
    {
        console.log(e);
        res.json({
            message:"Token not valid"
        })
    }
    
}

module.exports={
    adminAuth
}