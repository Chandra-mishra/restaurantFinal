const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
    //fk_user:[],
  name:{
      type: String,
      required: true
  } , 
  price:{
      type: Number,
      required:true 
  },
  priceCurrency:{
      type:String,
      required:true
  },
  item_description:{
      type:String,
      required:true
  },
  item_avaliable_time:{
     type: String,
     required:true
  },
     
      isSpecial:Boolean,
      subItems:[]
});

module.exports = mongoose.model('menuInfo',menuSchema);
menuSchema.set('timestamps', true);
