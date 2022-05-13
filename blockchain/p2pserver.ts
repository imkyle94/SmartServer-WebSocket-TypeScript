import WebSocket, { WebSocketServer } from "ws";

import fs from "fs";

const { serverData } = require("./serverData");
const Blocks = require("./models/blocks");
const Transactions = require("./models/transactions");

import { sequelize } from "../models/index";

// DB와 연결
sequelize
  // sync : MySQL에 테이블이 존재 하지 않을때 생성
  //      force: true   => 이미 테이블이 있으면 drop하고 다시 테이블 생성
  .sync({ force: false })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

// state
let clients = [];
let vote: number = 0;
let vote2: number = [0];
let block = [];
let pool = [];

function getPool() {
  return pool;
}

// WebSocket Server
const server = new WebSocketServer({ port: 8080 });

server.on("connection", function (client, req) {
  console.log("WebSocket Server Connect!");

  clients.push(client);

  // 지금까지는 흐름이었고
  // 만약 이제 서버에서 어떠한 데이터가 써졌다면
  // 그걸 send해주는 로직도 하나 만들어야 하네
  // 이게 그 블록을 db에 올리고 업데이트하라고 쏘는 그 부분인거지

  let Jh1 = [];
  let num = 0;
  let n1 = 0;
  let n2 = 0;
  let jh = 0;

  client.on("message", async function (data) {
    const data2 = data.toString();

    console.log(data2);
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

    for (i = 0; i < Jh1.length; i++) {
      const data1 = JSON.parse(Jh1[i]);
      const result = await serverData(data1);

      // 클라에서 브로드캐스트 요청했을 때
      if (data1[0] == "broadcast") {
        if (result[1] == "govalidblock") {
          const result1 = JSON.stringify(result);
          clients.forEach(function (client) {
            client.send(result1);
          });
        } else if (result[1] == "govalidtransaction") {
          const result1 = JSON.stringify(result);
          clients.forEach(function (client) {
            client.send(result1);
          });
        } else if (data1[1] == "validok") {
          vote++;
          // 51퍼
          if (vote / clients.length >= 0.51) {
            const data2 = data1.slice(2, data1.length);
            const data3 = data2[0];

            let result1 = ["broadcast", "goupdateblock", data3];
            // 여기 헤더로 블록 부분
            await Blocks.create(data3.header);

            for (i = 0; i < pool.length; i++) {
              await Transactions.create({
                index: data3.header.index,
                id2: pool[i].id,
                txOutId: pool[i].txIns.txOutId,
                txOutIndex: pool[i].txIns.txOutIndex,
                signature: pool[i].txIns.signature,
                address: pool[i].txOuts.address,
                amount: pool[i].txOuts.amount,
              });
              console.log("풀 DB create 완료");
              result1.push(pool[i]);

              if (i == pool.length - 1) {
                pool = [];
              }
            }

            const result2 = JSON.stringify(result1);
            block = [];
            vote = 0;

            console.log("블록 이어붙이기 성공!");
            clients.forEach(function (client) {
              client.send(result2);
            });
          } else {
            console.log("서버에서 보려고 쓴거임 51퍼가 안되었다오");
          }
        } else if (data1[1] == "validtransactionok") {
          // if (vote2[data1[2].txIns.txOutIndex] != -1) {
          // vote2[data1[2].txIns.txOutIndex] += 1;
          // if (vote[data1[2].txIns.txOutIndex] / clients.length >= 0.51) {
          // console.log("여기뜨면 끝");
          pool.push(data1[2]);
          // vote2[data1[2].txIns.txOutIndex] = -1;
          // }
          // }
        }
      }
      // 브로드캐스트 외 요청했을 때
      else {
        if (result[0] == "initConnect") {
          result.push(req.socket.remotePort);
          console.log("제발", result);
          console.log(clients);
          const result1 = JSON.stringify(result);
          client.send(result1);
        } else if (result[0] == "update") {
          result.push(client.remotePort);

          const result1 = JSON.stringify(result);
          client.send(result1);
        } else if (result[0] == "goChaegul") {
          console.log(client.remotePort, "번 포트 채굴 시작");
          const result1 = JSON.stringify(result);
          client.send(result1);
        } else if (result[0] == "goTrade") {
          console.log("트랜잭션 하기 시작");
          const result1 = JSON.stringify(result);
          client.send(result1);
        }
      }
    }
  });

  client.on("end", function () {
    console.log("WebSocket Client Well Exit!");
  });
});

module.exports = { getPool };

// server.listen(8880);
