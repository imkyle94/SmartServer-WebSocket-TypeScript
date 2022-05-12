const events = require("events");
const util = require("util");
const net = require("net");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

var port;

const { getPool } = require("./p2pserver");

const { clientData } = require("./clientData");

const { initBlocks, nextBlock } = require("./chainedBlock");
// const { addBlock } = require("./checkValidBlock");

const clientEvent = new events.EventEmitter();
// clientEvent.emit으로 실행시킨다

clientEvent.on("getBlocks", function () {
  let result = [];
  result.push("getBlocks");
  client.send(result);
});

clientEvent.on("getLocalData", function () {
  let result = [];
  result.push("getLocalData");
  client.send(result);
});

clientEvent.on("saveLocalData", function () {
  let result = [];
  result.push("saveLocalData");
  client.send(result);
});

// 블록에 넣을 트랜잭션 불러오기
clientEvent.on("getTransactions", function (data) {
  let result = [];
  result.push("getTransactions");
  client.send(result);
});

clientEvent.on("update", function () {
  // 파일 읽어서 마지막 길이를 보내서
  // 업데이트 해야하는지 안해야하는지로 판단하자
  // const length = fs.readFileSync
  let result = [];
  result.push("update");

  const size = fs.statSync(`./local/${port}.txt`).size;
  result.push(size);

  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("initConnect", function () {
  initBlocks();
  let result = [];
  result.push("initConnect");
  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("goChaegul", function () {
  let result = [];
  result.push("goChaegul");
  const result1 = JSON.stringify(result);
  client.send(result1);
});
clientEvent.on("goTrade", function (data) {
  let result = [];
  result.push("goTrade");
  result.push(data);
  const result1 = JSON.stringify(result);
  client.send(result1);
});

// 여기서부터 보면 댐

clientEvent.on("nextBlock", function () {
  const abcd = getPool();
  let result = [];

  for (i = 0; i < abcd.length; i++) {
    result[i] = JSON.stringify(abcd[i]);
  }

  if (abcd.length > 0) {
    const data = nextBlock(result);
    clientEvent.emit("broadcast_findBlock", data);
  } else {
    setTimeout(function () {
      clientEvent.emit("nextBlock");
    }, 5000);
  }
});

clientEvent.on("login", function () {
  let result = [];
  result.push("login");

  const local = fs.readFileSync(`./local/${a}.txt`, "utf8", (err) => {});
  // 지금은 다받았는데 그럺필요 없고 길이만 받으면 댐

  result.push(local);
  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("broadcast_findBlock", function (data) {
  let result = [];
  result.push("broadcast");
  result.push("findBlock");
  result.push(data);
  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("broadcast_validok", function (data) {
  let result = [];
  result.push("broadcast");
  result.push("validok");
  result.push(data);

  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("broadcast_transaction", function (data) {
  let result = [];
  result.push("broadcast");
  result.push("transaction");
  result.push(data);

  const result1 = JSON.stringify(result);
  client.send(result1);
});

clientEvent.on("broadcast_validtransactionok", function (data) {
  let result = [];
  result.push("broadcast");
  result.push("validtransactionok");
  result.push(data);

  const result1 = JSON.stringify(result);
  client.send(result1);
});

const client = new WebSocket("ws://localhost:8880");

// const ws = new WebSocket('ws://www.host.com/path',
// const client = net.createConnection({ port: 8880 }, function () {
//   console.log("고객 연결 되었습니다");
// });

let Jh1 = [];
let num = 0;
let n1 = 0;
let n2 = 0;
let jh = 0;

client.on("message", function (data) {
  const data2 = data.toString();

  Jh1 = [];
  jh = 0;
  n1 = 0;
  n2 = 0;
  num = 0;

  for (i = 0; i < data2.length; i++) {
    if (data2[i] == "[") {
      n1++;
    }
    if (data2[i] == "]") {
      n2++;
    }
    if (n1 == n2) {
      Jh1[jh] = data2.slice(num, i + 1);
      num = i + 1;
      jh++;
    }
  }

  console.log(Jh1.length);
  for (i = 0; i < Jh1.length; i++) {
    const data1 = JSON.parse(Jh1[i]);

    //  내가 받을 데이터 정제하는곳
    const result = clientData(data1);
    console.log(result);

    // 다시 요청하는 곳
    if (result[0] == "broadcast") {
      if (result[1] == "validok") {
        // 유효하면 다시 ok 보내는 거니까
        const data2 = result.slice(2, result.length);
        clientEvent.emit("broadcast_validok", data2[0]);
      } else if (result[1] == "validtransactionok") {
        const data2 = result.slice(2, result.length);
        clientEvent.emit("broadcast_validtransactionok", data2[0]);
      } else if (result[1] == "restart") {
        clientEvent.emit("nextBlock");
      }
    } else {
      if (result[0] == "initConnect") {
        port = result[result.length - 1];

        console.log(port);
      } else if (result[0] == "updateblock") {
        const data3 = result[1];

        // 여기는 아직 신경 안써도 되는거다
        const data5 = result.slice(1, result.length);
        const text = JSON.stringify(data5);

        fs.appendFileSync(`./local/${port}.txt`, text, "utf8", (err) => {});
        console.log("블럭 로컬 저장 완료 채굴 최종 성공!");

        clientEvent.emit("nextBlock");
      } else if (result[0] == "nextBlock") {
        clientEvent.emit("nextBlock");
      } else if (result[0] == "nextTransaction") {
        clientEvent.emit("broadcast_transaction", result[1]);
      }
    }
    // 사실 이건 이제 요청 로그를 잘보기위해 clientData에서 로그까지 받아서
    // 쏴주는 식으로 해야함
    // console.log("요청한 데이터 잘 들어 왔습니다", result);
    // client.end();
  }
});

client.on("end", function () {
  // 블럭을 메모리는 날라가니까
  // const b = fs.sendFile("./local/b.txt", "utf-8");
  console.log("고객 종료");
});

// clientEvent.emit("initConnect");
// setTimeout(function () {
// initBlocks();
//   clientEvent.emit("update");

//   setTimeout(function () {
//     const abc = nextBlock(["정호정호hi"]);
//     console.log("nextblock", abc);
//     setTimeout(function () {
//       clientEvent.emit("broadcast_findBlock", abc);
//     }, 10);
//   }, 50);
// }, 100);

module.exports = { clientEvent };
