const express = require('express');
const router = express.Router();
const db = require("../../module/pool.js");

router.get('/', async(req,res)=>{
	var cate = req.query.category;

	var storeListQuery = "SELECT * FROM store WHERE s_category = ?";
	var storeList = await db.queryParamArr(storeListQuery,[cate]);

	if(storeList){
		res.status(200).send({
			message : "Success to Show List",
			data : storeList //보내달라는거 보내주기.
		});
	}
	else {
		res.status(500).send({
			message : "Intetnal Server Error"
		});
	}
});




module.exports = router;
