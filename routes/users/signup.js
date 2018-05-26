const express = require('express');
const router = express.Router();

//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'users/signup' });
});


module.exports = router;
