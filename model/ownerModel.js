const mongoose = require('mongoose');
const ownerSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  } , 
  phone:{
      type: Number,
      required:true 
  },
  email:{
      type: String,
      required: true
  },
  
});
module.exports = mongoose.model('ownerInfo',ownerSchema);