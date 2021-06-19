const express = require("express");
const router = express.Router();
const connection = require ("../utils/db");
//為 api.js 加了一個 stocks 的路由，查詢所有股票代碼，並且以 res.json 的方式回覆
router.get("/stocks", async (req, res) =>{
    let stock_list = await connection.queryAsync("SELECT * FROM stock;");
    res.json(stock_list);
    
})
module.exports = router;