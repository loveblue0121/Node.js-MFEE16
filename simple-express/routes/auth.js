const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../utils/db");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");


//設定上傳檔案的儲存方式
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         //route/auth.js  <<目前檔案路徑
//         //public/uploads <<希望找到的檔案位置
//         //__dirname:  ...../routes/.../public/uploads
//         cb(null, path.json(__dirname, "../", "public", "uploads"));
//     },
//     //filename
// });
//用multer做一個上傳工具
// const uploader = multer({
//     storage: storage,
//     fileFilter: function(req, file, cb){
//         console.log(file);
//         if(file.mimetype !=="image/jpeg"){
//             return cb(new Error("檔案格式不正確"), false);
//         }
//         //檔案OK,接受這個檔案
//         cb(null, true);
//     },
//     limits: {
//         fileSize: 1024 * 1024,
//     }
// })


//註冊表單資料的驗證規則
const registerRules = [
    body("email").isEmail().withMessage("請正確輸入 Email 格式"),
    body("password").isLength({ min: 2 }),
    body("confirmPassword").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ];
router.get("/register", (req,res) => {
    res.render("auth/register");
});

//要有POST接收

router.post("/register", registerRules, async (req, res, next) => {
//加上中間件express.urlencoded的設定
//就可以透過req.body來取得POST的資料
    console.log(req.body);
    const vResult = validationResult(req);
    console.log(vResult);
    if(!vResult.isEmpty()){
        return next(new Error("註冊表單資料有問題"));
    }
    //檢查這個EMAIL是否註冊過
    let checkResult = await connection.queryAsync("SELECT * FROM members WHERE email = ?",req.body.email);
    if(checkResult.length > 0){
        return next(new Error("這個Email已經註冊過"));
    }
    let add = await bcrypt.hash(req.body.password, 10);
    let insertResult = await connection.queryAsync("INSERT INTO members (email, password, name) VALUE(?):",[[req.body.email, add, req.body.name]]);
    
    res.send("我收到了 POST register");
});

router.get("/login", (req,res) => {
    res.render("auth/login");
});

module.exports = router;