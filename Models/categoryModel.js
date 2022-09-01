const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
    
    categoryname:{
        type : String,
        required:true
    },
    discription:{
        type: String
    },
    alias:{
        type : String
    }
    
})

const category = mongoose.model('Category', categorySchema)
module.exports = category
