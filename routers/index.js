const axios = require("axios");
const express = require("express");

const Users = require("../models/users.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../build/index.html"));
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/practice", (req, res) => {
  const number = req.body;
  console.log(number);

  n1();
  //
  //
  // 함수 넣기
  // 세션 처리 넣어보자

  // 화면에 계속 뜨는 것은 웹소켓, 비동기?
  // 생각해보자
  res.send("채굴 시작!");
});

router.get("/userSession", async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.query.ID },
    });
    const api = await Apis.findAll({ where: { email: req.query.ID } });
    const result = { user, api };
    res.json(result);
  } catch {
    console.log("세션 에러");
  }
});

module.exports = router;
