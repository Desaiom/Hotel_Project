const express = require("express");
const router = express.Router();

// Index=  users

router.get("/",(req,res)=>{
    res.send("GET for user post");
});

router.get("/:id",(req,res)=>{
    res.send("GET for show posts");
});

router.post("/",(req,res)=>{
    res.send("POST for users");
});

router.delete("/:id",(req,res)=>{
    res.send("Delete for posts");
});

module.exports = router;