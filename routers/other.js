const express = require("express");
const path = require("path");
const axios = require("axios");

const router = express.Router();

router.route("*").get(async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "../build/index.html"));
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
