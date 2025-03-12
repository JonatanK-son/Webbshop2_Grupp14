const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Get products');
});

router.post('/', (req, res) => {
    res.send(req.body);
});

module.exports = router;

