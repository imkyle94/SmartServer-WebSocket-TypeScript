const events = require("events");
const util = require("util");
const net = require("net");

const { makeTransaction } = require("./transaction");

const bcclientEvent = new events.EventEmitter();

bcclientEvent.on("broadcast_goTransaction", function (data) {
  let result = [];
  result.push("broadcast");
  result.push("goTransaction");
  result.push(data);

  bcclient.write(result);
  // 브로드캐스트 할때 얘네한테는 안오도록 해야겠다
});

// 얘는 거래소
const bcclient = net.createConnection({ port: 8880 }, function () {
  console.log("거래 클라이언트 되었습니다");
});

bcclient.on("data", function (data) {
  const data1 = JSON.parse(data);
  console.log("요청한 데이터 잘 들어 왔습니다", data1);
});

bcclient.on("end", function () {
  console.log("거래 클라이언트 종료");
});

// bcclientEvent.emit("goTransaction", a);
