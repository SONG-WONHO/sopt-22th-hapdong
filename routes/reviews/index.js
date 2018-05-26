const express = require('express');
const router = express.Router();

const writeRouter = require("./write");

//테스트 용 입니다.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'reviews' });
});

router.use('/write', writeRouter);

module.exports = router;
