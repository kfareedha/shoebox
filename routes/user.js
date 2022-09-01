const { response } = require('express');
var express = require('express');
const session = require('express-session');
const { doLogin } = require('../helpers/user-helpers');
var router = express.Router();
var userHelpers= require('../helpers/user-helpers')
const auth=require('../helpers/auth')


/* GET home page. */
router.get('/',(req,res)=>{
      let session=req.session;
      res.render('user/index',{session})
      req.session.loginerr=false
    })
    
  
router.get('/login', function(req, res, next) {
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
    let session = req.session.check
    res.render('user/user-login',{session});
  }
  
});

router.post('/login',(req,res)=>{

  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.userloggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.check="invalid user name or password"
      res.redirect('/login')
    }
  })
})

router.get('/signup',(req,res,next)=>{
  if(req.session.userloggedIn){
    res.redirect('/')
  }else{
  let signupErr =req.session.check
  console.log(signupErr);
  res.render('user/user-signup',{signupErr})
  req.session.check=false
  }
})

router.post('/signup',(req,res)=>{
  console.log(req.body.password)
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.check){
      req.session.check=true
      res.redirect('/signup')
    }else{
      auth.sendOtp(req.body.mobile).then((verification)=>{
        req.session.mobile=req.body.mobile
         req.session.user=req.body
         res.redirect('/otp')
       })
    }
    
  })
})
router.post('/loginotp',(req,res)=>{
  auth.checkMobile(req.body.mobile).then((status) => {
    console.log(status)
    if (!status.check) {
      req.session.exist = true
      res.redirect('/login')
    } else {
      auth.sendOtp(req.body.mobile).then((verification => {
        req.session.exist = false
        req.session.mobile = req.body.mobile
        req.session.user = status.user
        console.log(req.session.user);
        res.redirect('/loginotp')
      }))
    }
  })
})
router.get('/loginotp',(req,res)=>{
  var mobile = req.session.mobile
  // res.send('otp')
  res.render('user/loginotp',{mobile})
})

router.post('/otpverify',(req,res)=>{
  auth.verifyOtp(req.body.otp, req.body.mobile).then((check) => {
    if (check === 'approved') {
      req.session.otpcheck = true
      req.session.userloggedIn=true
      
        res.redirect('/')
    } else {
      
      res.redirect('/loginotp')
    }
  })
})
router.get('/otp', ((req, res) => {
  var mobile = req.session.mobile
  
  
  res.render('user/signupotp', { mobile })
}))

router.post('/otp', ((req, res) => {
  auth.verifyOtp(req.body.otp, req.body.mobile).then((check) => {
    if (check === 'approved') {
      
      userHelpers.doSignup(req.session.user).then((data) => {
        req.session.user = data
        req.session.loggedIn=true
        req.session.userloggedIn = true
        res.redirect('/')
      })
    } else {
      
      res.redirect('/otp')
    }
  })
}))

router.get('/profile',(req,res)=>{
  if(req.session.userloggedIn){
  let userData=req.session.user
  res.render('user/userprofile',{layout:'profilelayout',userData})
  }else{
    let session = req.session.check
    res.redirect('/');
  }

})
router.get('/update-profile',(req,res)=>{
  if(req.session.userloggedIn){
    let userData=req.session.user
  res.render('user/updateprofile',{userData})
  }else{
    let session = req.session.check
    res.redirect('/');
  }
})



router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
