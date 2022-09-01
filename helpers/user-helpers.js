const async = require('hbs/lib/async');
const { reject } = require('bcrypt/promises')
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
    
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let {name,email,mobile,password,confirmPassword}=userData

                password= await bcrypt.hash(password,10)
                 user = new User({
                    name,
                    email,
                    mobile,
                    password,
                    confirmPassword
                })

                user.save().then((data)=>{
                    console.log(data)
                    resolve(data)
                }).catch((err)=>{
                    console.log(err)
                })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await User.findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    
}