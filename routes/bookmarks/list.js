const express = require('express');
const router = express.Router();

const db = require('../../module/pool');


//테스트 용 입니다.
router.get('/', async (req, res, next) => {
    let user_idx = req.query.user_idx;

    console.log(req.query);

    let selectQuery = "SELECT bookmark.s_idx, s_name, s_desc, s_image FROM bookmark JOIN store ON bookmark.s_idx = store.s_idx WHERE bookmark.u_idx = ?";
    let selectResult = await db.queryParamArr(selectQuery, [user_idx]);

    if (!selectResult){

        res.status(500).send({
            message: "Internal Server Error"
        })

    } else if (selectResult.length === 0) {

        res.status(200).send({
            message:"No data"
        })

    } else {

        res.status(200).send({
            message: "Success to Show List",
            data: selectResult
        })
    }
});


module.exports = router;
