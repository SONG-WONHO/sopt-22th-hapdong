const express = require('express');
const router = express.Router();

const db = require('../../module/pool');


//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'bookmarks/register' });
});

router.post('/', async function(req, res, next) {

    let store_idx = req.body.store_idx;
    let user_idx = req.body.user_idx;

    let insertQuery = "INSERT INTO bookmark (s_idx, u_idx) VALUES (?, ?)";
    let insertResult = await db.queryParamArr(insertQuery, [store_idx, user_idx]);

    if (!insertResult) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    } else {
        res.status(200).send({
            message: "Successfully registered"
        })
    }
});

module.exports = router;
