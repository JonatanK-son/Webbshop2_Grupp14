const router = require('express').Router();
const db = require('../models');

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

