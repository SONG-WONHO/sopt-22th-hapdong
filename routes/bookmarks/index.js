const express = require('express');
const router = express.Router();

const deleteRouter = require("./delete");
const listRouter = require("./list");
const registerRouter = require("./register");

router.use('/delete', deleteRouter);
router.use('/list', listRouter);
router.use('/register', registerRouter);

module.exports = router;
