const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const hotelController = require('./controller/hotelController');


const app = express();
const port = process.env.PORT || 9008;
mongoose.connect('mongodb://prasad18:prasad18@ds147566.mlab.com:47566/hotel2',{ useNewUrlParser: true },()=>{
    console.log('successfully connected!!!');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.listen(port, function() {
    console.log(`Node.js listening on port ${ port }`);
});
app.use('/',hotelController);
