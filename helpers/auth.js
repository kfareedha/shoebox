const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserModel = require('../models/userModel');
const accountSid = "AC9863566808c6e9d7b3c89c88846e4b89"
const authToken = "69cace3146ff1bcac464e8c44386449b"
const client = require('twilio')(accountSid, authToken);

module.exports={
    userCheck:(email)=>{
        console.log(email);
        return new Promise(async(resolve,reject)=>{
            let user = await UserModel.findOne({email})
            let status = {
                check:false
            }
            if(user){
                status.check=true
                status.user=user
                resolve(status)
            }else{
                resolve(status)
            }
        })

    },
    checkMobile:(mobile)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await UserModel.findOne({mobile})
            console.log(user)
            let status = {
                check:false
            }
            if(user){
                status.check=true
                status.user=user
                resolve(status)
            }else{
                resolve(status)
            }
        })
    },  
sendOtp: (mobile) => {
                    console.log(mobile)
                    return new Promise((resolve, reject) => {
                        client.verify.v2.services('VA706c7db1e4d169e3726b38cd49c4f952')
                            .verifications
                            .create({ to: '+91' + mobile, channel: 'sms' })
                            .then(verification => {
                                console.log(mobile);
                                console.log(verification.status)
                                resolve(verification)
                            });
                    })
            
                },
                verifyOtp: (otp, mobile) => {
                    return new Promise((resolve, reject) => {
                        client.verify.v2.services('VA706c7db1e4d169e3726b38cd49c4f952')
                            .verificationChecks
                            .create({ to: '+91' + mobile, code: otp })
                            .then((verification_check) => {
                                console.log(verification_check.status)
                                resolve(verification_check.status)
                            });
                    })
                }
            }