require('dotenv').config()

const  express = require('express');
const   mongoose=require('mongoose');
const bodyParser = require('body-parser');

const  userRouter=require('./routes/user')
const  adminRouter=require('./routes/admin')
const  courseRouter=require('./routes/courses');

const app= express();

app.use(bodyParser.urlencoded({extended:false}))
const url=process.env.MONGO_URL
app.use('/user',userRouter);
app.use('/courses', courseRouter);
app.use('/admin', adminRouter);


async function main()
{
    await mongoose.connect(url);
    app.listen(3000, ()=>{
        console.log('Server is liseting')
    });
}

main();