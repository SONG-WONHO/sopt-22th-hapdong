const express = require('express');
const router = express.Router();
const async = require('async');
const upload = require('../../config/multer.js');
const pool = require('../../config/dbPool.js');


//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'reviews/write' });
    console.log(req.url);
});


router.post('/', upload.single('image'), function(req, res){
	let u_idx;
	let user_id = req.body.user_id;
	let r_time = req.body.time;
	let r_desc = req.body.desc;
	let r_image; 

	let taskArray = [
	// 1. pool에서 connection 하나 가져오기
		function(callback) {
      pool.getConnection(function(err, connection) {
        if (err) {
          res.status(500).send({
            message: "Internal Server Error"
          });
          callback("pool.getConnection Error : " + err);
        } else {
          callback(null, connection);
        }
      });
    },

    // 2. get user_id from user table

    	function(connection, callback){
    		let getUserIdQuery = "SELECT u_idx FROM user WHERE u_id = ? ";
    		connection.query(getUserIdQuery, user_id, function(err, result){
    			if (err) {
          res.status(500).send({
            message: "Internal Server Error"
          });
          connection.release(); // connection 반환
          callback("connection.query Error : " + err);
        } else {
					if (result.length === 0){
						res.status(204).send({
							message : "No Data"
						});
						connection.release();
						callback("No Data");
					} else {
			u_idx = result[0].u_idx;
			callback(null, connection, result[0]);
				}
			}
      });
    },

    // 3. insert review info
    function(connection, result, callback){
    	let insertReviewQuery = "INSERT INTO review (r_time, r_desc, r_image, u_idx) VALUES (?, ?, ?, ?) ";
    	connection.query(insertReviewQuery, [r_time, r_desc, r_image, u_idx], function(err, result){
    	if (err) {
          res.status(500).send({
              message: "Internal Server Error"
          });
          callback("connection.query Error : " + err);
        } else {
          res.status(200).send({
            message: "Success to Review Resgister"
          });
          callback(null, "Success to Review Resgister");
        }
        connection.release(); // connection 반환
      });
    }

	]

if(req.file==undefined){
		res.status(422).send({
			message : "No image File"
		});
	} else{ // image 파일이 정상이면 
		r_image = req.file.key; // s3 상에 저장되는 file name임 -> config/multer에서 설정 해준것
	async.waterfall(taskArray, function(err, result){
		if(err){
			console.log(err);
		} else {
			console.log(result);
		}
	});

}
});



module.exports = router;
