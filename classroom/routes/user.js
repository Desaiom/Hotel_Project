const express = require("express");
const router = express.Router();

// Index=  users

router.get("/",(req,res)=>{
    res.send("GET for user id");
});

router.get("/:id",(req,res)=>{
    res.send("GET for show users");
});

router.post("/",(req,res)=>{
    res.send("POST for users");
});

router.delete("/:id",(req,res)=>{
    res.send("Delete for users");
});

module.exports = router;