const router = require('express').Router();
const db = require('../models');
const db validate = require('validate.js');

const constraints = {
    title: {
        minimum: 2,
        maximum: 100,
        tooShort: '^The product name must be at least %{count} characters long.'
        tooLong: '^The product can not be longer than &{count} characters long.'
    }
}

router.get('/', (req, res) => {
    db.products.findAll().then((result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    
    db.products.create(req.body).then(result => {
        res.send(result);
    });
});

router.put('/', (req, res) => {
    db.products
     .update(req.body, {
        where: {id: req.body.id } 
    })
    .then(result => {
        res.send(result);
    })
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

