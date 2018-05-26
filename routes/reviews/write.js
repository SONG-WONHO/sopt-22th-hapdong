const express = require('express');
const router = express.Router();

//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'reviews/write' });
    console.log(req.url);
});


module.exports = router;
