const waterfall = require('async-waterfall');
const express = require('express');
const async = require('async');
const router = express.Router();
const Owner = require('../model/ownerModel');
const Menu = require('../model/menuModel');
const Restaurant = require('../model/restaurantModels');
const Hours = require('./hr');
const hours = require('./hours.json');
const fs = require('fs');
router.post('/ownerinfo', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

   function insertRecord(req,res){
    var owner = {
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email
    }
    //create new ownerinfo
    var ownerInfo = new Owner(owner);
 
    ownerInfo.save().then(()=>{
        console.log('owner data inserted sucessfully');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('Thank you inserting owner info!!!');

   } 

   //update ownerInfo
   function updateRecord(req,res){
     Owner.findOneAndUpdate(req.body._id,{
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email
     },{ new: true },(err,doc)=>{
        
        if(!err){
              res.json(doc);
        }
        else{
               console.log('please correct the error'+err);
        }
     });

   }
//delete ownerInfo
router.delete('/owner/:id',(req,res)=>{
    Owner.findOneAndRemove(req.params.id).then(()=>{
        res.send('successfully removed ownerInfo');
    }).catch(err=>{
        if(err){
            throw err;
        }
        
    });
});
//insert and update restaurantinfo
   router.post('/restaurantinfo', (req, res) => {
    if (req.body._id == '')
        insertRestaurent(req, res);
        else
        updateRestaurant(req, res);
});

//insert restaurant details
function insertRestaurent(req,res){
    var restaurant = {
        location : req.body.location,
        opening_hours : req.body.opening_hours,
        //reservation_table: req.body.reservation_table,
       // good_for: req.body.good_for
    }
    //create new reservation
    var reservationInfo = new Restaurant(restaurant);
    reservationInfo.save().then(()=>{
        console.log('successfully inserted.');
    })
    .catch((err)=>{
        if(err){
            throw err;
        }
    })
    res.send('thank you for inserting new restaurant details');
}

//update restaurant
function updateRestaurant(req,res){
    Restaurant.findOneAndUpdate(req.body._id,{
        location : req.body.location,
        opening_hours : req.body.opening_hours
     },{ new: true },(err,doc)=>{
        
        if(!err){
              res.json(doc);
        }
        else{
               console.log('please correct the error'+err);
        }
     });  
}
//delete restaurantInfo
router.delete('/restaurant/:id',(req,res)=>{
    Restaurant.findOneAndRemove(req.params.id).then(()=>{
        res.send('successfully removed restaurantInfo');
    }).catch(err=>{
        if(err){
            throw err;
        }
        
    });
});


router.post('/menudetails', (req, res) => {
    if (req.body._id == '')
        insertMenu(req, res);
        else
        updateMenu(req, res);
});

//insert menu
function insertMenu(req,res){
    var menu = {
        name : req.body.name,
       price: req.body.price
    }
    //create new menu
    var menuInfo = new Menu(menu);
 
    menuInfo.save().then(()=>{
        console.log('sussfully inserted menu data.');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('Thank you inserting menu details!!!');
}

//update menu
function updateMenu(req,res){
    Menu.findOneAndUpdate(req.body._id,{
        name : req.body.name,
        price: req.body.price
     },{ new: true },(err,doc)=>{
        
        if(!err){
              res.json(doc);
        }
        else{
               console.log('please correct the error'+err);
        }
     });    
}

///delete menudetails
router.get('/menu/:id',(req,res)=>{
    Menu.findOneAndRemove(req.params.id).then(()=>{
        res.send('successfully removed menuInfo');
    }).catch(err=>{
        if(err){
           throw err;
        }
        
    });
});

//populating ownerInfo and menuDetails
router.get('/restaurantdetails',(req,res)=>{
async.waterfall([
    ownerInfo,
    menuDetails,
    restaurantInfo
],function (err, result) {
    if(err){
        res.json(err);
    }else{
        res.json(result);
    }
  
    });
    function ownerInfo(callback){
        
         Owner.find().then((ownerInfo1)=>{
            callback(null,[ownerInfo1[0]]);
        }).catch(err =>{
            if(err){
                callback(err,null);
             }
        });
        
    }
    function menuDetails(arg1,callback){
         Menu.find().then((menuItems1) =>{
            //var menuItems=menuItems1;
             //menuItems[0].fk_user = arg1;
             //menuItems.map((mergeOwner)=>{mergeOwner.fk_user = arg1});
            callback(null,arg1,menuItems1);
        }).catch(err=>{
             if(err){
                callback(err,null);
             }
        });
        
    }
    function restaurantInfo(arg1,arg2,callback){
        Restaurant.find().then((restaurantInfo)=>{
            var restaurant = restaurantInfo;
            restaurant.map((mergeRestaurant) => {
                mergeRestaurant.ownerDetails = arg1;
                mergeRestaurant.menuDetails = arg2;
            });
            callback(null,restaurant);
        }).catch(err =>{
            if(err){
                callback(err,null);
            }
        });
    }
});

//business hours
/*router.get('/businesshours',(req,res)=>{
    const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const isBreakfast = true;
    const isLunch = true;
    const isDinner = true;
    

        
      if(weekdays[0] === "sunday"){
        console.log(weekdays[0]+'              '+"Closed");
        }
    if(weekdays[1] === 'monday'){ 
        if(isBreakfast){
           console.log(weekdays[1]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[1]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
    
    if(weekdays[2] === 'tuesday'){
        if(isBreakfast){
            console.log(weekdays[2]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[2]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
    if(weekdays[3] === 'wednesday'){
        if(isBreakfast){
            console.log(weekdays[3]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[3]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
    if(weekdays[4] === 'thursday'){
        if(isBreakfast){
            console.log(weekdays[4]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[4]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
    if(weekdays[5] === 'friday'){
        if(isBreakfast){
            console.log(weekdays[5]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[5]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
    if(weekdays[6] === 'saturday'){
        if(isBreakfast){
            console.log(weekdays[6]+'              '+"Breakfast-->8AM-11AM");
        }
        else{
            console.log(weekdays[6]+'                      '+'--');
        }
        if(isLunch){
            console.log('                    '+'Lunch--->1PM-3PM');
        }
        else{
            console.log('                    '+'--');
        }
        if(isDinner){
            console.log('                    '+'Dinner--->7PM-11PM');
        }
        else{
            console.log('                    '+'--');
        }
    }
});*/

router.get('/businesshour',(req,res)=>{
    fs.readFile('./controller/hours.json', (err, data) => {  
        if (err) throw err;
        let hours = JSON.parse(data);
            res.json(hours);
            
    });
});

module.exports = router;

