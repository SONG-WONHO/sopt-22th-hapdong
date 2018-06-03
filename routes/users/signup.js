const express = require('express');
const router = express.Router();

const db = require('../../module/pool');
const crypto = require('crypto-promise');


//테스트 용 입니다.
router.get('/', (req, res, next) => {
    res.render('index', { title: 'users/signup' });
});

//회원가입 라우터
router.post('/', async (req, res, next) => {

    //유저id와 유저pw를 post 방식으로 받음
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pw;

    //유저id와 유저pw가 잘 입력됐는 지 검증 - 추후 escape 설정
    if (!user_id || !user_pw){
        res.status(400).send({
            message: "Null Value"
        })
    } else { //잘 입력 됐다면 ...

        //1) db에 등록된 유저가 있는 지 검증
        let checkQuery = "SELECT * FROM user WHERE u_id = ?";
        let checkResult = await db.queryParamArr(checkQuery, [user_id]);

        if (!checkResult) { // 쿼리수행중 에러가 있을 경우
            res.status(500).send({
                message : "Internal Server Error"
            });

        } else if (checkResult.length === 1){ // 유저가 존재할 때
            res.status(400).send({
                message : "Already Exists"
            });

        } else {//2) 패스워드 생성 후 유저 정보 저장 - hash, salt
            const salt = await crypto.randomBytes(32);
            const hashedpw = await crypto.pbkdf2(user_pw, salt.toString('base64'), 100000, 32, 'sha512');

            //DB에 유저 정보 저장 쿼리
            let insertQuery = "INSERT INTO user (u_id, u_pw, u_salt) VALUES (?, ?, ?)";
            let insertResult = await db.queryParamArr(insertQuery, [user_id, hashedpw.toString('base64'), salt.toString('base64')]);

            if(!insertResult){ // 쿼리수행중 에러가 있을 경우
                res.status(500).send({
                    message : "Internal Server Error"
                });
            } else {
                res.status(201).send({
                    message: "Success to Sign Up"
                })
            }
        }
    }

});



module.exports = router;
