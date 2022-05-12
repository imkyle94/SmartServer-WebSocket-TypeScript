const fs = require("fs");

const Blocks = require("./models/blocks");
const Transactions = require("./models/transactions");

// 서버가 들어온 요청에 대해 처리해줄 곳
// 서버가 DB에서 불러올건지 자기 로컬에서 불러 올 건지 선택을..
// 일단은 블록은 DB, 트랜잭션은 자기 로컬에서 불러오는 걸로 둘다 써봅시다

// 서버 입장에서
// get요청은 쏴줄 데이터 return해주기
// 다른 요청들은 자기 DB에 쓰기
async function serverData(data) {
  // 브로드캐스트 요청
  if (data[0] == "broadcast") {
    if (data[1] == "findBlock") {
      const data1 = data.slice();
      data1.shift();
      data1.shift();
      const result = ["broadcast", "govalidblock", ...data1];
      return result;
    } else if (data[1] == "validok") {
      const data1 = data.slice(2, data.length);
      // 일부러 써논거임 result[1] undefined 라서
      const result = ["broadcast", "goblock!"];
      return result;
    } // 2 거래소에서 트랜잭션들이 넘어올 때
    else if (data[1] == "transaction") {
      const data1 = data.slice();
      data1.shift();
      data1.shift();
      const result = ["broadcast", "govalidtransaction", data1[0]];
      return result;
    } else if (data[1] == "validtransactionok") {
      const data1 = data.slice(2, data.length);
      // 일부러 써논거임 result[1] undefined 라서
      const result = ["broadcast", "gotransaction!"];
      return result;
    }
  }
  // 브로드캐스트 외 요청
  else {
    if (data[0] == "initConnect") {
      const result = [];
      result.push("initConnect");
      const block = await Blocks.findAll();
      result.push(block);

      return result;
    } else if (data[0] == "update") {
      const result = [];
      result.push("update");
      const block = await Blocks.findAll();

      // if (data[1] < block.length) {
      // result.push(block);
      // }

      result.push(block);
      return result;
    } else if (data[0] == "getBlocks") {
      // 일단 이런거 해주긴 하는데 쓸데는 크게 없다
      const result = [];
      return result;
    } else if (data[0] == "getTransactions") {
      const db = Transactions.findAll({});
      const result = [];
      result.push(db);
      return result;
    } else if (data[0] == "goChaegul") {
      const result = [];
      result.push("goChaegul");
      return result;
    } else if (data[0] == "goTrade") {
      const result = [];
      result.push("goTrade");
      result.push(data[1]);
      return result;
    }
  }
}

module.exports = { serverData };
