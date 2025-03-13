const router = require('express').Router();
const db = require('../models');
const db validate = require('validate.js');

const constraints = {
    title: {
        length: {
            minimum: 2,
            maximum: 100,
            tooShort: '^The product name must be at least %{count} characters long.'
            tooLong: '^The product can not be longer than &{count} characters long.'
        }
    }
};

router.get('/', (req, res) => {
    db.products.findAll().then((result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    const product = req.body;
    const invalidData = validate(product, contraints);
    if(invalidData) {
        res.status(400).json(invalidData);
    } else {
        db.products.create(product).then(result => {
        res.send(result);
    }); 
    }
});

router.put('/', (req, res) => {
    const product = req.body;
    const invalidData = validate(product, contraints);
    const id = post.id
    if(invalidData || !id ) {
        res.status(400).json(invalidData || 'Id is mandotary');
    } else {
        db.products
        .update(product, {
           where: {id: product.id } 
       })
       .then(result => {
           res.send(result);
       });
    }
});

router.delete('/', (req, res) => {
    db.products
    .destroy({
        where: {id: req.body.id } 
    })
    .then((result) => {
        res.json(`Produkten togs bort`);
    });
});


module.exports = router;

