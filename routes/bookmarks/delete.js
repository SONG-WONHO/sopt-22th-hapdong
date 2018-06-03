const express = require('express');
const router = express.Router();

const db = require('../../module/pool');


//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'bookmarks/delete' });
});

router.delete('/', async (req,res, next) => {

    let user_idx = req.body.user_idx;
    let store_idx = req.body.store_idx;


    let deleteQuery = "DELETE FROM bookmark WHERE s_idx = ? AND u_idx = ?";
    let deleteResult = await db.queryParamArr(deleteQuery, [store_idx, user_idx]);

    if(!deleteResult) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    } else {
        res.status(200).send({
            message: "Success to delete"
        })
    }

})


module.exports = router;
