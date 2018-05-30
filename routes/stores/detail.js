const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/aws_config.json');
const s3 = new aws.S3();

const upload = require('../../config/multer.js');

const imgList = require('../../config/imgList.js');
const bucketID = require('../../config/bucketID.json');

const async = require('async');
const pool = require('../../config/dbPool.js');

var menuInfo = [];
var storesInfo = [];
var reviewInfo = [];
var detailInfo;

router.get('/', function(req, res){
	res.send("success");
});

router.post('/', function(req, res){
	let s_idx = req.body.s_idx;
	let s_category = req.body.s_category;
	let s_name = req.body.s_name;

	let taskArray = [ 
		//1. check null value
		function(callback) {
			if(!s_idx || !s_category || !s_name){
				res.status(400).send({
					message : "Null Value"
				});
				callback("Null Value");
			} else {
				callback(null)
			}
		},
		//2. get connection of pool
		function(callback){
			pool.getConnection(function(err, connection){
				if(err) {
					res.status(500).send({
						message : "Internal Server Error1"
					});
					callback("pool.getConnection Error : " + err);
				} else {
					callback(null, connection);
				}
			});
		},

		//3. get menu info
		function(connection, callback){
			let getMenuInfoQuery = "SELECT menu.m_name, menu.m_pirce FROM menu WHERE s_idx = ? ";
			connection.query(getMenuInfoQuery, s_idx, function(err, result){
				if(err) {
					res.status(500).send({
						message : "Internal Server Error2"
					});
					connection.release();
					callback("connection.query Error : " + err);
				} else {
					if (result.length === 0){
						res.status(204).send({
							message : "No Data"
						});
						connection.release();
						callback("No Data");
					} else {
						menuInfo.name = result[0].m_name;
						menuInfo.price = result[0].m_price;
						callback(null, connection, result[0]);
					}
				}
			});
		},
		//4. get stores info
		function(connection, result, callback){
			let getStoresInfoQuery = "SELECT COUNT(u_idx), s_desc, s_image FROM store NATURAL JOIN review WHERE s_idx = ? ";
			connection.query(getStoresInfoQuery, s_idx, function(err, result){
				if(err) {
					res.status(500).send({
						message : "Internal Server Error3"
					});
					connection.release();
					callback("connection.query Error : " + err);
				} else {
					if (result.length === 0){
						res.status(204).send({
							message : "No Data"
						});
						connection.release();
						callback("No Data");
					} else {
						storesInfo.review_count = result[0].COUNT(u_idx);
						stroesInfo.desc = result[0].s_desc;

						for(var imgStr in imgList){
							if(imgStr === result[0].s_image){
								storesInfo.image = "https://s3.ap-northeast-2.amazonaws.com/" + bucketID.ID + result[0].s_image;
							}
						}
						callback(null, connection, result[0]);
					}
				}
			});
		},

		//5. get review info
		function(connection, result, callback){
			let getReviewInfoQuery = "SELECT A.u_id, A.r_time, A.r_desc, A.r_image FROM review NATURAL JOIN user AS A WHERE s_idx = ?";
			connection.query(getReviewInfoQuery, s_idx, function(err, result){
					if(err) {
					res.status(500).send({
						message : "Internal Server Error4"
					});
					connection.release();
					callback("connection.query Error : " + err);
				} else {
					if (result.length === 0){
						res.status(204).send({
							message : "No Data"
						});
						connection.release();
						callback("No Data");
					} else {
						reviewInfo.user_id = result[0].u_id;
						reviewInfo.time = result[0].r_time;
						reviewInfo.desc = result[0].r_desc;
						for(var imgStr in imgList){
							if(imgStr === result[0].s_image){
								reviewInfo.image = "https://s3.ap-northeast-2.amazonaws.com/" + bucketID.ID + result[0].r_image;
							}
						}
						callback(null, connection, result[0]);
					}
				}
			});

		}


	];

	async.waterfall(taskArray, function(err, result){
		if (err){
			console.log(err);
		} else {
			console(result);
			detailInfo = {
				message : "Success to Show Detail Info",
				menu : menuInfo,
				stores : storesInfo,
				reviews : reviewInfo
			};
		}
	});

});
module.exports = router;
