const express = require('express');
const router = express.Router();

const usersRouter = require('./users/index');
const storesRouter = require('./stores/index');
const reviewsRouter = require('./reviews/index');
const bookmarksRouter = require('./bookmarks/index');

//테스트 용 입니다.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

//case 유저
router.use('/users', usersRouter);

//case 매장
router.use('/stores', storesRouter);

//case 리뷰
router.use('/reviews', reviewsRouter);

//case 북마크
router.use('/bookmarks', bookmarksRouter);

module.exports = router;
