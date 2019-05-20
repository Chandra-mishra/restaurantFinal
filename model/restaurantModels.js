const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({
    ownerDetails:[],
    menuDetails:[],
  location:{
      type: String,
      required: true
  } , 
  opening_hours:{
      type: String,
      required:true 
  },
  /*reservation_table:{
      type: String,
      required:true
  },
  good_for:{
    type: String,
    required:true
  }*/
});

module.exports = mongoose.model('restaurant',restaurantSchema);