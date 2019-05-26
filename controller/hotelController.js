 const waterfall = require('async-waterfall');
const express = require('express');
const async = require('async');
const router = express.Router();
const Owner = require('../model/ownerModel');
const Menu = require('../model/menuModel');
const Special = require('../model/item');
const Restaurant = require('../model/restaurantModels');
const Order = require('../model/order');
const Hours = require('./hr');
const hours = require('./hours.json');
const fs = require('fs');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);

router.post('/ownerinfo',(req,res)=>{
    var owner = {
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email
    }
    //create new owner
    var owners = new Owner(owner);
 
    owners.save().then(()=>{
        console.log('new owner created');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('thank you for inserting new items!');
});

//updating ownerInfo
router.post('/ownerupdate',(req,res)=>{
Owner.findByIdAndUpdate(req.body._id,{
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
},
function(err){
    if(err) throw err;
    res.send('thank you for updating owner info');
});
});

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
//insert and update menuInfo
router.post('/menuinfo',(req,res)=>{
    var menu = {
        name : req.body.name,
        price : req.body.price,
        priceCurrency : req.body.priceCurrency,
        item_description: req.body.item_description,
        item_avaliable_time: req.body.item_avaliable_time
    }
    //create new menu
    var menuInfo = new Menu(menu);
 
    menuInfo.save().then(()=>{
        console.log('new menu created');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('successfully created menu');
});

//update menu info
router.post('/menuupdate',(req,res)=>{
    Menu.findByIdAndUpdate(req.body._id,{
        name : req.body.name,
        price : req.body.price,
        priceCurrency : req.body.priceCurrency,
        item_description: req.body.item_description,
        item_avaliable_time: req.body.item_avaliable_time
    },
    function(err){
        if(err) throw err;
        res.send('thank you for updating owner info');
    });
    });

  
//delete menuinfo
router.delete('/menu/:id',(req,res)=>{
    Menu.findByIdAndDelete(req.params.id).then(()=>{
        res.send('successfully removed menuItem');
    }).catch(err=>{
        if(err){
            throw err;
        }
        
    });
});
//insert and update restaurant info
router.post('/restaurantinfo',(req,res)=>{
    var restaurant = {
        name : req.body.name,
        location: req.body.location
    }
    //create restaurant details
    var restaurantInfo = new Restaurant(restaurant);
 
    restaurantInfo.save().then(()=>{
        console.log('restaurant details inserted');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('restaurant details inserted');
});
//update restaurant info
router.post('/restaurantupdate',(req,res)=>{
    Restaurant.findByIdAndUpdate(req.body._id,{
        name : req.body.name,
        location: req.body.location
    },
    function(err){
        if(err) throw err;
        res.send('thank you for updating owner info');
    });
    });
//delete restaurant 
router.delete('/restaurant/:id',(req,res)=>{
    Restaurant.findByIdAndDelete(req.params.id).then(()=>{
        res.send('successfully removed restaurantInfo');
    }).catch(err=>{
        if(err){
            throw err;
        }
        
    });
});

//------------------------------------------------------------------

//insert and update special items
router.post('/specialItem',(req,res)=>{
    var special = {
        name : req.body.name,
        price : req.body.price,
        priceCurrency : req.body.priceCurrency,
        item_description: req.body.item_description,
        item_avaliable_time: req.body.item_avaliable_time
    }
    //create special items
    var specialItemsInfo = new Special(special);
 
    specialItemsInfo.save().then(()=>{
        console.log('successfully inserted special items');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('successfully inserted special items');
});
//update special items
router.post('/specialupdate',(req,res)=>{
    Special.findByIdAndUpdate(req.body._id,{
        name : req.body.name,
        price : req.body.price,
        priceCurrency : req.body.priceCurrency,
        item_description: req.body.item_description,
        item_avaliable_time: req.body.item_avaliable_time
    },
    function(err){
        if(err) throw err;
        res.send('thank you for updating special items');
    });
    });
//delete special items
router.delete('/specialitem/:id',(req,res)=>{
    Special.findByIdAndDelete(req.params.id).then(()=>{
        res.send('successfully removed special items');
    }).catch(err=>{
        if(err){
            throw err;
        }
        
    });
});

//insert and update order items
router.post('/orderItem',(req,res)=>{
    var order = {
        name : req.body.name,
       item_name: req.body.item_name,
        price : req.body.price,
        email: req.body.email,
        phone: req.body.phone
    }
    //create ordered items
    var orderItemsInfo = new Order(order);
 
    orderItemsInfo.save().then(()=>{
        console.log('successfully inserted special items');
    }).catch((err)=>{
        if(err){
            throw err;
        }
  });
  res.send('successfully inserted special items');
});
//update special items
router.post('/orderupdate',(req,res)=>{
    Order.findByIdAndUpdate(req.body._id,{
        name : req.body.name,
        item_name: req.body.item_name,
         price : req.body.price,
         email: req.body.email,
         phone: req.body.phone
    },
    function(err){
        if(err) throw err;
        res.send('thank you for updating special items');
    });
    });
//delete special items
router.delete('/orderitem/:id',(req,res)=>{
    Order.findByIdAndDelete(req.params.id).then(()=>{
        res.send('successfully removed special items');
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
    specialItems,
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

    function specialItems(arg1,callback){
        Special.find().then((specialItems1) =>{
           //var specialItem=specialItems1;
            //specialItem.subItems = arg2;
           // specialItem.map((mergeOwner)=>{mergeOwner.subItems = arg2});
           callback(null,arg1,specialItems1);
       }).catch(err=>{
            if(err){
               callback(err,null);
            }
       });
       
   }
    function menuDetails(arg1,arg2,callback){
         Menu.find().then((menuItems1) =>{
            var menuItems=menuItems1;
             //menuItems.subItems = arg2;
             menuItems.map((mergeOwner)=>{mergeOwner.subItems = arg2});
            callback(null,arg1,arg2,menuItems1);
        }).catch(err=>{
             if(err){
                callback(err,null);
             }
        });
        
    }


    function restaurantInfo(arg1,arg2,arg3,callback){
        Restaurant.find().then((restaurantInfo)=>{
            var restaurant = restaurantInfo;
            restaurant.map((mergeRestaurant) => {
                mergeRestaurant.ownerDetails = arg1;
                mergeRestaurant.menuDetails = arg3;
                mergeRestaurant.specialItems = arg2;
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
        if(hours)
            res.json(hours);
            
    });
});

// Charge Route
router.post('/charge', (req, res) => {
    stripe.customers.create({
      amount:req.body.amount,
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
      amount,
      description: 'Buying restaurant items',
      currency: 'INR',
      customer: customer.id
    }))
    .then((charge)=>{
        res.send(charge);
    });
  });
//get all owner info
  router.get('/allOwnerInfo',(req,res)=>{
    Owner.find({},function(err,allOwnerInfo){
        if(err) throw err;
        res.send(allOwnerInfo);
    })
  });
  //get all menu info
  router.get('/allMenuInfo',(req,res)=>{
    Menu.find({},(err,allMenuInfo)=>{
        if(err) throw err;
        res.send(allMenuInfo);

    })
  });
  //get all special item info
  router.get('/allspecialItem',(req,res)=>{
      Special.find({},(err,allSpecialInfo)=>{
          if(err) throw err;
          res.send(allSpecialInfo);
      })
  });
//get all order items
router.get('/allorderitems',(req,res)=>{
Order.find({},(err,allorderinfo)=>{
    if(err) throw err;
    res.send(allorderinfo);
})
});
module.exports = router;
