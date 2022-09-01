var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
const Admin = require('../models/adminModel');
const adminHelpers=require('../helpers/admin-helpers')
// const User = require('../models/userModel');


/* GET home page. */
router.get('/', function (req, res, next) {
 console.log(req.session.adminLoggedIn)
  if (req.session.admin) {
    res.redirect('/admin/adminhome');
  } else {
    res.render('admin/admin-login')
    req.session.adminLoggErr = false;
  }
});

router.post('/', async(req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {   
      console.log(response);  
      console.log("response");   
 
      req.session.admin= response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin/adminhome')
    } else {
      req.session.adminLoginErr = "Invalid email or password"
      res.redirect('/admin')
    }
  })
});
  
router.get('/adminhome', function (req, res, next) {
  console.log(req.session.adminLoggedIn)
   if (req.session.admin) {
     res.render('admin/admin-home');
   } else {
     res.redirect('/admin')
     req.session.adminLoggErr = false;
   }
 });

 router.get('/view-user', function (req, res, next) {
  adminHelpers.getAllUsers().then((userdetails)=>{
   if (req.session.admin) {
     res.render('admin/view-user',{users:userdetails});
   } else {
     res.redirect('/admin')
     req.session.adminLoggErr = false;
   }
 })
});





router.get('/view-products', function (req, res, next) {
  adminHelpers.getAllProducts().then((products)=>{
   if (req.session.admin) {
     res.render('admin/view-products',{products});
   } else {
     res.redirect('/admin')
     req.session.adminLoggErr = false;
   }
 })
});

router.get('/add-product',(req,res)=>{
  
  let exist = req.session.productexist


  res.render('admin/add-product',{exist})
});
router.post('/add-product',(req,res)=>{
  adminHelpers.addProduct(req.body).then((response)=>{
      console.log(response)
      if(response.check){
          req.session.productexist=true
          res.render('admin/add-product',{exist: req.session.productexist})
          req.session.productexist=false

      }else{
          res.redirect('/admin/view-products')
      }
  })
});

router.get('/edit-product/:id', async (req, res) => {
  
  if (req.session.adminLoggedIn) {
    let product = await adminHelpers.getProduct(req.params.id)
    res.render('admin/edit-product', {product})
    
  } else {
    res.redirect('/admin');
  }
});

router.post('/edit-product', (req, res) => {
  adminHelpers.editProduct(req.body).then(() => {
    res.redirect('/admin/view-products')
  })
});
router.get('/delete-product/:id',(req,res)=>{
  adminHelpers.deleteProduct(req.params.id).then(()=>{
      res.redirect('/admin/view-products')
  })
});







router.get('/view-category',(req,res)=>{
  if(req.session){
      adminHelpers.getAllCategory().then((categories)=>{
          res.render('admin/view-categories',{categories})
      })
  }else{
      res.redirect(302,'/admin/login')
  }
});
router.get('/add-category',(req,res)=>{
  
  let exist = req.session.categoryexist


  res.render('admin/addcategory',{exist})
});

router.post('/add-category',(req,res)=>{
  adminHelpers.addCategory(req.body).then((response)=>{
      console.log(response)
      if(response.check){
          req.session.categoryexist=true
          res.render('admin/addcategory',{exist: req.session.categoryexist})
          req.session.categoryexist=false

      }else{
          res.redirect('/admin/view-category')
      }
  })
});
router.get('/edit-category/:id', async (req, res) => {
  
  if (req.session.adminLoggedIn) {
    let categories = await adminHelpers.getCategory(req.params.id)
    res.render('admin/editcategory', {categories})
    
  } else {
    res.redirect('/admin');
  }
});

router.post('/edit-category', (req, res) => {
  adminHelpers.editCategory(req.body).then(() => {
    res.redirect('/admin/view-category')
  })
});
router.get('/delete-category/:id',(req,res)=>{
  adminHelpers.deleteCategory(req.params.id).then(()=>{
      res.redirect('/admin/view-category')
  })
});







router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/admin');
});
module.exports = router;