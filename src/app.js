const express=require('express');
const bodyparser= require('body-parser');


const port=process.env.PORT || 3000
const app=express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : true}));


app.get("/",(req,res)=>{
    res.json({message: " Siddharth kandola assignment"})
})

// For routes 

const router=require('./router/route')
app.use(router)



app.listen(port,()=>{
    //console.log(temp)
    console.log("Server is running guys")
})