const express = require('express');
const router = express.Router();

const detailRouter = require("./detail");
const listRouter = require("./list");
const registerRouter = require("./register");

//테스트 용 입니다.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'stores' });
});

router.use('/detail', detailRouter);
router.use('/list', listRouter);
router.use('/register', registerRouter);

module.exports = router;
