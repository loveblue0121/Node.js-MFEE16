const express = require("express");
// 可以把router想成一個小的獨立的應用
const router = express.Router();
// router.use...router.get.....
const connection = require ("../utils/db");

//查詢資料庫
router.get("/", async (req, res) =>{
    let stock_list = await connection.queryAsync("SELECT * FROM stock;");
    res.render("stock/list", {
        stocks: stock_list,
    });
})

//在路由上名稱前有: 為變數
router.get("/:stockCode", async (req, res, next) => {
    let stock = await connection.queryAsync("SELECT * FROM stock WHERE stock_id=?;",req.params.stockCode);
    if(stock.length ===0){
        next();
    }

    stock = stock[0];
    //總共有幾筆
    let count = await connection.queryAsync("SELECT COUNT(*) as total FROM stock_price WHERE stock_id=?;",req.params.stockCode);
    //console.log(count); [ RowDataPacket { total: 12 } ]
    const total = count[0].total; //總筆數
    const perPage = 5; //每頁筆數
    const lastPage = Math.ceil(total / perPage); //總頁數  Math.ceil>無條件進位
    //現在在第幾頁 || 1就是預設1
    const currentPage = req.query.page || 1;
    //每頁從第幾筆開始
    const offset = (currentPage-1) * perPage;
    let queryResult = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id=? ORDER BY date limit ? offset ?;",[req.params.stockCode,perPage,offset]);//req.params.stockCode 這個方法就可以拿到stock的變數

    
    res.render("stock/detail", {
        stock,
        stockPrices: queryResult,
        pagination: {
            lastPage,
            currentPage,
            total,            
        },
    });
});
module.exports = router;