const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../utils/db");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require("path");
const { ResultWithContext } = require("express-validator/src/chain");


//設定上傳檔案的儲存方式
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //route/auth.js  <<目前檔案路徑
        //public/uploads <<希望找到的檔案位置
        //__dirname:  ...../routes/.../public/uploads
        cb(null, path.join(__dirname, "../", "public", "uploads"));
    },
    //filename
    filename: function(req, file, cb){
        //抓出副檔名
        const ext = file.originalname.split(".").pop();
        // 組合出自己想要的檔案名稱
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
});
//用multer做一個上傳工具
const uploader = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        console.log(file);
        if(file.mimetype !=="image/jpeg"){
            return cb(new Error("不合法的檔案類型"), false);
        }
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("是不合格的副檔名"));
          }
        //檔案OK,接受這個檔案
        cb(null, true);
    },
    limits: {
        //限制檔案上傳大小
        fileSize: 1024 * 1024,
    },
});
//要有POST接收
router.get("/register", (req,res) => {
    res.render("auth/register");
});

//註冊表單資料的驗證規則
const registerRules = [
    body("email").isEmail().withMessage("請正確輸入 Email 格式"),
    body("password").isLength({ min: 2 }),
    body("confirmPassword").custom((value, { req }) => {
      return value === req.body.password;
    }),
  ];

 
router.post("/register",uploader.single("photo"), registerRules, async (req, res, next) => {
//加上中間件express.urlencoded的設定
//就可以透過req.body來取得POST的資料
    console.log(req.body);
    const vResult = validationResult(req);
    console.log(vResult);
    if(!vResult.isEmpty()){// 不是空的，就是有問題
        return next(new Error("註冊表單資料有問題"));
    }
    //檢查這個EMAIL是否註冊過
    let checkResult = await connection.queryAsync("SELECT * FROM members WHERE email = ?",req.body.email);
    if(checkResult.length > 0){
        return next(new Error("這個Email已經註冊過"));
    }
    let filepath = req.file ? "/uploads/" + req.file.filename : null;
    let add = await bcrypt.hash(req.body.password, 10);
    let insertResult = await connection.queryAsync("INSERT INTO members (email, password, name) VALUE(?);",[[req.body.email, add, req.body.name]]);
    
    res.send("註冊成功");
});
//-------------------登入-------------------------
router.get("/login", (req,res) => {
    if(req.session.member){
        req.session.message = {
            title: "重複登入",
            text: "你已經登入過了喔..."
        }
        return res.redirect(303, "/");
    }
    res.render("auth/login");
});

const loginRules = [
    body("email").isEmail().withMessage("請正確輸入 Email 格式"),
    body("password").isLength({ min: 2 })
];

router.post("/login", loginRules, async (req,res) => {
    const vResult = validationResult(req);
    if(!vResult.isEmpty()){// 不是空的，就是有問題
        return next(new Error("註冊表單資料有問題"));
    }
    //檢查email是否存在
    let member = await connection.queryAsync("SELECT * FROM members WHERE email = ?",req.body.email);
    if(member.length === 0){
        return next(new Error("沒有這個帳號"));
    }
    member = member[0];
    //比對密碼
    //因為bcrypt 每次加密的結果都不一樣，所以不能單純的比對字串
    let result = bcrypt.compare(req.body.password, member.password);//必須要bcrypt提供的比對函式

    if(result){
        req.session.member = {
            email: member.email,
            name: member.name,
            photo: member.photo,
        };
        req.session.message = {
            title: "登入成功",
            text: "恭喜你終於成功了!",
        };
        //轉跳頁面 status code303(see Other)
        res.redirect(303, "/");
    }else{
        req.session.member = null;

        //處理錯誤訊息
        req.session.message = {
            title: "登入失敗",
            text: "請填寫正確的帳號或密碼"
        }
        //轉到登入頁面
        res.redirect(303, "auth/login");
    }
    
});
router.get("/logout", (req, res)=>{
    req.session.member = null;
    req.session.message = {
        title: "已登出",
        text: "期待你下次的登入",
      };
    res.redirect(303, "/");
})

module.exports = router;