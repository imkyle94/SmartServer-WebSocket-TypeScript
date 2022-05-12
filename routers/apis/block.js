// 아 씨발 이제 알았다 왜 /api로 해놓는지
// 같은 서버에서 이용하려고 하는거구나

// 그리고 자동화 처리를 좀 해볼 수 있을 줄 알았는데
// 1차로 실패했다 뭐 통제성에 대한 이유를 어느 정도 파악은 하고 있지만
// 이를 그대로 따르기가 싫어서 그랬던 것도 있고
// 자동화에 대한 로망도 있긴 했는데 조금은 아쉽네
// 이를 정리해서 표현해야겠다
// 그래도 진척은 계속 있다.

const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const axios = require("axios");

const Users = require("../../models/users");
const Blocks = require("../../models/blocks");

const dotenv = require("dotenv");
dotenv.config();

// const { dbscheme, makedb } = require("../../dblization");
const { getBlocks, createGenesisBlock } = require("../../chainedBlock");

const {
  initWallet,
  getPublicKeyFromWallet,
  getPrivateKeyFromWallet,
} = require("../../encryption");
const { makeTransaction } = require("../../transaction");

const { clientEvent } = require("../../p2pclient");

const router = express.Router();

// 아직은 로그인 미들웨어 안쓰지만 나중에 쓸 수 있으니
router.get("/", () => {
  console.log("aaa");

  //여기에 로딩이 되도록 적어야겠네
});

router.post("/initConnect", (req, res) => {
  clientEvent.emit("initConnect");
  res.send("처음 연결 성공");
});

router.post("/initWallet", (req, res) => {
  const data = req.body.email;
  console.log(data);
  initWallet(data);
  res.send("처음 지갑 성공");
});

router.post("/Chaegul", (req, res) => {
  clientEvent.emit("goChaegul");
  res.send("채굴 시작합니다");
});

router.post("/initTrade", (req, res) => {
  const data = req.body;
  let my = [];
  my[0] = req.user.email;
  // txOutIndex 뭔지 몰라서 일단 3으로 해놈
  my[1] = 3;

  const privateKey = getPrivateKeyFromWallet();
  const transaction = makeTransaction(my, data, privateKey);

  clientEvent.emit("goTrade", transaction);

  res.send("거래 데이터 보내기 성공");
});

router.post("/update", (req, res) => {
  clientEvent.emit("update");
});

module.exports = router;
