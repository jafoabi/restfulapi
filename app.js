const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

mongoose.connect('mongodb+srv://ask4josef:'+ process.env.MONGO_ATLAS_PASSWORD +  '@cluster0-ldhvs.mongodb.net/test?retryWrites=true&w=majority'),
 {
     useMongoClient: true
 }

app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == 'OPTIONS') {
        res.header("Access-Control-Allow-Methods",'PUT, GET, POST, PATCH, DELETE');
        return res.status(200).json({}); 

    }

});

app.use((req, res, next) => { 
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((error,req,res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    }); 
});   
module.exports = app; 