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
app.use(function(req, res, next){
    let current = new Date();
    console.log(`有人來訪問了 在${current}`);
    //幾乎都要呼叫，讓他往下繼續
    next();
});
//可指定一個或多個目錄是「靜態資源目錄」
//自動幫你為public裡面的檔案建立路由
app.use(express.static("public")); //必須建立在所有中間件上面
//第一個是變數，第二個是檔案夾名稱
app.set("views", "views");
//告訴express我們用的view engine是pug
app.set("view engine", "pug");
//路由router  (request, response){} 去回應這個請求
//由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/",function(req, res){
    res.render("index");
});

app.get("/test",function(req, res){
    res.send("TESTTTTTT");
});
//查詢資料庫
app.get("/stock", async (req, res) =>{
    let stock_list = await connection.queryAsync("SELECT * FROM stock;");
    res.render("stock/list", {
        stocks: stock_list,
    });
    
})

//在路由上名稱前有: 為變數
app.get("/stock/:stockCode", async (req, res) => {
    //req.params.stockCode 這個方法就可以拿到stock的變數
    let stock_list = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;", req.params.stockCode);
    res.render("stock/detail", {
        stockPrices: stock_list,
    })
})
app.get("/about",function(req, res){
    res.render("about");
});
app.listen(3000, async () =>{
    await connection.connectAsync();
    console.log(`悄悄的我又來了~~~~`);
})