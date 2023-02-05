
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/hero',{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log("DB CONNECTED");
}).catch(err=>console.log(err));
const app = express();

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    country: String,
    age: Number,
})

const UserModel = mongoose.model('userInfo', userSchema);

//Create
app.post('/api/v8/user/info',async(req,res)=>{
    const user = await UserModel.create(req.body);
    res.status(201).json({
        success: true,
        user
    })
})

//Read
app.get('/api/v8/users',async(req,res)=>{
    const users = await UserModel.find();
    res.status(200).json({
        success: true,
        users
    })
})

//Update
app.put('/api/v8/user/:id',async(req,res)=>{
    let user = await UserModel.findById(req.params.id);
    if(!user){
        return res.status(500).json({
            success: false,
            message: 'User not found'
        })
    }
     user = await UserModel.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:true,runValidators:true});
    
    
    res.status(200).json({
        success:true,
        modUser
    })
})

//Delete
app.delete('/api/v8/user/:id',async(req,res)=>{
    const user = await UserModel.findById(req.params.id);
    if(!user){
        return res.status(500).json({
            success: false,
            message: 'User not found'
        })
    }
    await user.remove()
    res.status(200).json({
        success:true,
        message: 'Deleted Sucessfully'
    })
})

app.listen(3000);