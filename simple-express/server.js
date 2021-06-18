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

//路由router  (request, response){} 去回應這個請求
//由上而下找，找到就停住了，不會在往下一個同樣的執行
app.get("/",function(req, res){
    res.send("Hello Express");
});
app.get("/test",function(req, res){
    res.send("TESTTTTTT");
});
app.get("/about",function(req, res){
    res.send("about Express");
});
app.listen(3000, () =>{
    console.log(`悄悄的我又來了~~~~ 在port3000`);
})