const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const upload = require('../../config/multer.js');


router.post('/', upload.single('image'), async(req, res) => {
    var category = req.body.category;
    var name = req.body.name;
    var desc = req.body.desc;
    var menu = req.body.menu;
    var image = null;
    if(req.file){
    	image = req.file.location;
    }

    console.log(image);
    console.log(menu);
    console.log(menu.length);

    var registerStoreQuery = "INSERT INTO store (s_category, s_name, s_desc,s_image) VALUES(?,?,?,?)";
    var registerStore = await db.queryParamArr(registerStoreQuery, [category, name, desc,image]);

    if (menu) {
        for (let i = 0; i <= menu.length; i++) {
            var registerMenuQUery = "INSERT INTO menu (m_name,m_price,s_idx) VALUES (?,?,?)";
            var registerMenu = await db.queryParamArr(registerMenuQUery, [menu[i].menuName, menu[i].price, registerStore.insertId]);
        }
    }
    if (registerStore) {
        res.status(201).send({
            message: "Success to Register Store"
        });
    }
    else {
    	res.status(500).send({
    		message : "Internal Server Error"
    	});
    }

});
module.exports = router;