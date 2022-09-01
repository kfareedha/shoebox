const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');  
const categoryModel = require('../Models/categoryModel'); 
const productModel = require('../Models/productModel');   
module.exports={
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let email = adminData.email
            let password = adminData.password

            let admin = await adminModel.find({ email:email,password:password })
            console.log("admin foun");   

            let response = {}
            if (admin) {
                    response.status = true
                    response.admin = admin
                    resolve(response)
            } else {
                response.status = false
                console.log("wrong admin");   

                resolve(response)
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let userdetails=await userModel.find({}).lean()
            resolve(userdetails)
        })
    },
 
    


addProduct: (productDetails) => {
    return new Promise(async (resolve, reject) => {
        let {productname,productdescription,productimage,productprice,productcategory} = productDetails
        let product = await productModel.findOne({ productname })
        let status = {
            check: false
        }
        if (product) {
            status.check = true
            resolve(status)
        } else {
            newProduct= new productModel({
                productname,
                productdescription,
                productimage,
                productprice,
                productcategory
            }
            )
            newProduct.save().then((data)=>{
                console.log(data)
                status.data=data
                resolve(status)
            })
        }
    })
},
getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products = await productModel.find({}).lean()
        resolve(products) 
    })
},
deleteProduct:(id)=>{
    return new Promise((resolve,reject)=>{
        productModel.findByIdAndDelete(id).then((data)=>{
            console.log(data)
            resolve(data)
        })
    })
},
getProduct:(id)=>{
    return new Promise(async(resolve,reject)=>{
        let product = await productModel.findOne({_id:id}).lean()
        resolve(product)
    })
},
editProduct:(details)=>{
    return new Promise((resolve,response)=>{
        productModel.findByIdAndUpdate(details.id,{productname:details.productname, productdescription:details.productdescription,productimage:details.productimage,productprice:details.productprice,productcategory:details.productcategory}).then((data)=>{
            console.log(data)
            resolve(data)
        })
    })
},





    getAllCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let categories = await categoryModel.find({}).lean()
            resolve(categories) 
        })
    },
   
    addCategory: (categoryDetails) => {
    return new Promise(async (resolve, reject) => {
        
        let {categoryname} = categoryDetails
        let alias=categoryname.toLowerCase();
        let category = await categoryModel.findOne({ alias })
        let status = {
            check: false
        }
        if (category) {
            status.check = true
            resolve(status)
        } else {
            newCategory = new categoryModel({
                categoryname,
                alias
            }
            )
            newCategory.save().then((data)=>{
                console.log(data)
                status.data=data
                resolve(status)
            })
        }
    })
},

deleteCategory:(id)=>{
    return new Promise((resolve,reject)=>{
        categoryModel.findByIdAndDelete(id).then((data)=>{
            console.log(data)
            resolve(data)
        })
    })
},
getCategory:(id)=>{
    return new Promise(async(resolve,reject)=>{
        let category = await categoryModel.findOne({_id:id}).lean()
        resolve(category)
    })
},
editCategory:(details)=>{
    return new Promise((resolve,response)=>{
        categoryModel.findByIdAndUpdate(details.id,{categoryname:details.categoryname}).then((data)=>{
            console.log(data)
            resolve(data)
        })
    })
},
}