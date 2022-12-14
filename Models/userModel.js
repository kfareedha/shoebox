const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
    name:{
        type : String,
        required : true
    },
    
    email:{
        type : String,
        required : true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type : String,
        required : true

    },
    confirmpassword:{
        type : String

    }
    
})
const users = mongoose.model('User', userSchema)
module.exports = users
