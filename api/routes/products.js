const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Product = require('../models/product');


router.get('/',(req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            product: docs.map( doc =>{
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/products/' + doc._id
                
                    }
                }
            })  
        };
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
         
    });
});


router.post('/',(req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price:  req.body.price
    });
    product.save().then(result =>{ console.log(result);
    }); 
    res.status(200).json({ 
        messaage: 'created product successfully',
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            type: 'GET',
            url: "http://localhost:3000/products/" + result._id

        }
    });
});


router.post('/',(req,res,next) =>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    
    }
    res.status(200).json({
        messaage: 'Order was created',
        order: order
    }) ; 
});

router.get('/:productId',( req,res,next) => {
   const id = req.params.productId;
   Product.findById(id)
   .select('name price _id')
   .exec()
   .then(doc => {
       console.log('From database',doc);
       if (doc) {
           res.status(200).json({
               product: doc,
               request: {
                   type: "GET",
                   url: 'http://127.0.0.1:3000/products'
               }
           });
        
       }
       else {
           res.status(404).json({message: "No Valid entry found for the provided id"})
       }
       res.status(200).json(doc);

   })
   .catch(err =>  { 
       console.log(err);
   
   res.status(500).json({error: err});
   });
});

router.patch('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    const updateOps ={};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
           error: err
    });
    });
});


router.delete("/:productId", (req, res, next) =>{
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;