const express = require('express');
const router = express.Router();

const signupRouter = require("./signup");
const signinRouter = require("./signin");

//테스트 용 입니다.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'users' });
});

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);


module.exports = router;
