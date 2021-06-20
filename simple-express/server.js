const connection = require ("./utils/db")

//導入express這個package
const express = require("express");
//利用express建立一個express application app
let app = express();
//middleware 中間件(中介函式)
/*在express裡
req->router
req->middleware.....->router
*/
//app.use設定中間件
//req.body拿到post資料
app.use(express.urlencoded({ extended: false })); //加上這個中間件，就可以解讀POST過來的資料
//前端送json data,express才能解析
app.use(express.json());
//想要拿到cookie
const cookieParser = require("cookie-parser");
app.use(cookieParser());
//想要拿到session
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了 在${current}`);
    //幾乎都要呼叫，讓他往下繼續
    next();
});
//可指定一個或多個目錄是「靜態資源目錄」
//自動幫你為public裡面的檔案建立路由
/*ex. /javascript/api.js
      


*/
app.use(express.static("public")); //必須建立在所有中間件上面
//第一個是變數，第二個是檔案夾名稱
app.set("views", "views");
//告訴express我們用的view engine是pug
app.set("view engine", "pug");

//把這個動作做在中間函式
//把req.session設定給res.locals
app.use(function(req, res, next){
    //把request的session資料設定給res的locals
    //view就可以取得資料
    res.locals.member = req.session.member;
    next();
})

app.use(function (req, res, next){
    //訊息只希望被顯示一次，所以傳到views一次後就刪掉
    if(req.session.message){
        res.locals.message = req.session.message;
        delete req.session.message;
    }
    next();
})

let memberRouter = require("./routes/member");
app.use("/member", memberRouter);
// 股票模組
let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);
//建立router
let apiRouter = require("./routes/api");
app.use("/api", apiRouter);

let authRouter = require("./routes/auth"); //路徑
app.use("/auth", authRouter); //名稱
//路由router  (request, response){} 去回應這個請求
//由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/",function(req, res){
    
    res.cookie("lang", "zh-TW");
    
    
    res.render("index");
});
app.get("/test",function(req, res){
    res.send("TESTTTTTT");
});

app.get("/about",function(req, res){
    res.render("about");
});
//所有的路由下面
app.use(function (req, res, next){
    //進到這邊表示前面的路由都找不到 status code:404
    res.status(404);
    res.render("404");
});
// 500 error 放在所有路由的後面
app.use(function(err, req, res, next){
    console.log("ERROR:", err.message);
    res.status(500);
    res.send("500 - 沒救了");
})
app.listen(3000, async () =>{
    await connection.connectAsync();
    console.log(`悄悄的我又來了~~~~`);
})