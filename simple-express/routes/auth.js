const express = require("express");
const router = express.Router();

router.get("/register", (req,res) => {
    res.render("auth/register");
});
//要有POST接收
router.post("/register", (req,res) => {
    res.send("我收到了 POST register");
});

router.get("/login", (req,res) => {
    res.render("auth/login");
});

module.exports = router;