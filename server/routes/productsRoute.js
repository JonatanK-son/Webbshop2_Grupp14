const router = require('express').Router();
const db = require('../models');

router.get('/', (req, res) => {
    db.products.findAll().then((result) => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    res.send(req.body);
});

router.put('/', (req, res) => {
    res.send('Put products');
});

router.delete('/', (req, res) => {
    res.send('Delete products');
});


module.exports = router;

