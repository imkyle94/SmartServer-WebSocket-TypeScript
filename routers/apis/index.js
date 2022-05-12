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

const router = express.Router();

// 아직은 로그인 미들웨어 안쓰지만 나중에 쓸 수 있으니
router.get("/", () => {
  //여기에 로딩이 되도록 적어야겠네
});

router.get("/aa", (req, res) => {
  const cclient = net.createConnection({ port: 8880 }, function () {
    console.log("고객 연결 되었습니다");
  });

  clientEvent.emit("initConnect");
});

router.post("/trade", (req, res) => {
  const data = req.body;
  let my = [];
  my[0] = req.user.email;
  my[1] = 3;
  const privateKey = getPrivateKeyFromWallet();
  const transaction = makeTransaction(data, my, privateKey);

  // 여기서 실행하던 뭘 넘기던 해야대
  console.log(transaction);

  res.json(data);
});

router.post("/wallet", (req, res) => {
  initWallet(req.user.email);
  // 세션 처리를 어케해줄까?

  res.json(["지갑 생성 성공!"]);
});

router.post("/cg", (req, res) => {
  const { clientEvent } = require("../p2pclient");
  // 그리고 이걸 세션이던 미들웨어던으로 처리해버리자

  // 뷰에 소켓 연결되었습니다 하나 쏴주고
  // 되었을 때 메뉴 여러개 만들자

  // 요청을 하면 백에서든 소켓 구현이 잘되어서 양방향으로 받아지고 있음
  // 이걸 프론트에 올릴때 방법을 지금 어떻게 할지 생각하는중이다
  // clientEvent.emit("initConnect");

  // clientEvent.emit("initConnect");
});

router.post("/make", async (req, res) => {
  try {
    // 꼭 비동기로 써야되는지는 모르겠는데?
    // 여기서 처리 나눠야지
    if (req.body.button) {
      const data = getBlocks();
      const header = data[0].header;

      const pratice = Object.assign(header);
      console.log(pratice);
      const data2 = dbscheme(header);
      const data3 = JSON.stringify(header);
      res.json(data2);
    } else {
      // const data2 = dbscheme(data.header);
      res.json("ok");
    }

    // console.log(req.body.button);
    // else 처리해줘야함
  } catch (err) {
    console.log("make 처리 오류");
  }
});

router.post("/make2", (req, res) => {
  // 꼭 비동기로 써야되는지는 모르겠는데?
  // 여기서 처리 나눠야지
  const data = req.body;
  const data2 = makedb(data);
  // console.log(data2);
  // 여기서 나타내주는거 쓰면 됨
  // 대신 여기서 stringfy 쓰자
  res.json(data2);
});

router.post("/openapi", async (req, res) => {
  try {
    console.log("오픈 api 들어와져용");
    // console.log(req.body);
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    for (key in req.body) {
      // 될 줄 알았다
      // 막아논듯 씨발 왜 안대
      // console.log(value(key));
      console.log(key);
      const value = req.body[key];
      // console.log(req.body[key]);
      // const a = await Blocks.findOne({ key: req.body[key] });
      const a = await Blocks.findOne({ where: { index: value } });

      // console.log(a);
      if (a) {
        console.log("된당");
      }
      // console.log(a);
      // if (Blocks.findOne({ key })) {
      //   console.log("된당 ㅋ");
      // }
    }

    // for (value in req.body) {
    //   console.log(req.body[value]);
    // }

    // 이제 여기 들어온 것으로 찾는 걸 할 텐데

    // getblock 함수 쓰고
    // 쿼리 넣어서 찾고 다시 쏴줘야지

    //

    // 여기서 이제 데이터 찾기가 들어갈 텐데 일단 적어보자
    // 이건 클라이언트 - 서버 관계야
    // 기존 서버에 있던 데이터가 지금은 어디에 있지?
    // 하이브리드 p2p라면 인덱스 컴퓨터가 있고 이를 서버로 보면 될 것이야 이게 마스터노트일 수도 있지
    // 퓨어p2p라면 인덱스 컴퓨터, 서버가 없어서 이 네트워크를 구현해 놔야해
    // 이 부분 정리하고 밥먹자
    res.redirect("/");
  } catch (err) {
    console.log("OpenApi 오류중");
  }
});

module.exports = router;
