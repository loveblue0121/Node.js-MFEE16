//http 是 NodeJs 內建的web server，所以不用安裝
const http = require("http");
const {URL} = require("url");
const fs = require("fs/promises");
// createServer(Listener)
//Listener(request, response)負責處理進來的連線
/* request 是請求物件
   response是回覆物件
*/
const server = http.createServer((req, res) => {
    console.log("連線");
    console.log(req.url);

    const path = req.url.replace(/\/?(?:\?.*)?$/,"").toLocaleLowerCase(); //移除非必要的結尾斜線，並轉小寫
    //replace()- 指定搜尋值並已指定字元取代
    console.log(`path:${path}`);
    //about範例執行結果path:/about
    //about?name=max範例執行結果about?name=max


    //處理query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log("query string:",url.searchParams);
    //about?name=max範例執行結果 =>query string: URLSearchParams { 'name' => 'max' }
    res.statusCode = 200; //2xx, 3xx, 4xx, 5xx
    res.setHeader("Content-Type", "text/plain;charset=UTF-8");
    //路由 router
(async function(){
    switch (path){
        case "":
            res.end("這是首頁 你好安安");
            break;
        case "/test":
            res.setHeader("Content-Type", "text/html;charset=UTF-8");
            let content = await fs.readFile("test.html");
            //去讀test.html檔案，並處理html
            res.end(content);
            break;
        case "/about":
            let name = url.searchParams.get("name") || "路人甲"; // || = 預設值
            //如果有搜尋到解析的網址上有name=，就顯示在文字上
            res.end(`Hi, ${name} 這是關於我們`);
            break;    
        default:
            res.writeHead(404);
            res.end("Not Found");
    }
})();    
});
//開始listen
server.listen(3000, () =>{
    console.log("悄悄的我來了~");
});
// localhost 127.0.0.1
// PHP -->搭配 web server (apach or nginx)
// NodeJs 直接開發一個web server 