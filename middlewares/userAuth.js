const {JWT_USER_SECRET} = require('../config')

const {userModel} =require('../db')


const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')


async function userAuth(req, res, next)
{
    const token= req.headers.token

    try{
        const decoded=jwt.verify(token, JWT_USER_SECRET);
        const mongoID=new mongoose.Types.ObjectId(decoded._id)
        const response= await userModel.findOne({_id:mongoID})
        req.body.user=response;
        next();
    }
    catch(err)
    {
        console.log(err)
        res.json({
            message:"Token not valid"
        })
    }
}

module.exports={userAuth}