const fs = require("fs");

const { getBlocks, Blocks } = require("./chainedBlock");
const { addBlock } = require("./checkValidBlock");
const { checkValidTransaction } = require("./transaction");

// 클라이언트가 받을 데이터에 대한 처리
// 이미 데이터가 서버로 어떠한 처리를 거쳐 바로 사용할 수 있게 왔다고 생각
function clientData(data) {
  // 브로드캐스트 데이터
  if (data[0] == "broadcast") {
    // 얘는 공지 느낌으로다가 브로드캐스트 일때
    if (data[1] == "govalidblock") {
      const data1 = data.slice(2, data.length);

      const abcde = addBlock(data1[0]);
      // 여기까지 됨
      if (abcde) {
        const result = [];

        result.push("broadcast");
        result.push("validok");
        result.push(data1[0]);
        return result;
      } else {
        const result = [];
        result.push("broadcast");
        result.push("restart");
        return result;
      }

      // 이제 여기 처리 해보자
    } else if (data[1] == "goupdateblock") {
      const data1 = data.slice(2, data.length);
      const data2 = ["updateblock", ...data1];
      return data2;
    } else if (data[1] == "govalidtransaction") {
      const data1 = data.slice(2, data.length);

      if (checkValidTransaction(data1[0])) {
        let result = [];
        result.push("broadcast");
        result.push("validtransactionok");
        result.push(data1[0]);
        return result;
      }
      // 아마 이부분 오류 날거야 처리해줘야댐
      else {
        let result = [];
        result.push("broadcast");
        result.push("validtransactionno");
        return result;
      }
    }
  }
  // 개인으로 요청한 데이터
  else {
    if (data[0] == "initConnect") {
      if (data[1]) {
        const port = data[data.length - 1];
        const result = data.slice(1, data.length - 1);
        const text1 = JSON.stringify(result);
        const text2 = JSON.stringify(port);
        if (fs.existsSync(`./local/${port}.txt`)) {
          fs.unlinkSync(`./local/${port}.txt`, (err) => {});
        }
        fs.writeFileSync(`./local/${port}.txt`, text1, "utf8", (err) => {});
        fs.writeFileSync(
          `./local/${port}_port.txt`,
          text2,
          "utf8",
          (err) => {}
        );
      }
      return data;
    } else if (data[0] == "update") {
      if (data[1]) {
        const port = data[data.length - 1];
        const result = data.slice(1, data.length);
        const text1 = JSON.stringify(result);
        fs.appendFileSync(`./local/${port}.txt`, text1, "utf8", (err) => {});
      }
      return data;
      // 그리고 여기서 체인드 블록 업데이트까지 해줘야해
    } else if (data[0] == "getBlocks") {
      // get블록이잖아 사실 getblocks은 양방향으로 안써도 되지
      // 내 요청이니까
      // getblock보다는 블록에 어떠한 수정이 일어나면
      // 자동으로 update가 일어나게 하는 거니까
      // getblocks는 사실 필요없는 요청이야
      // 그래도 걍 써놔 일단
      const result = [];

      return result;
    } else if (data[0] == "goChaegul") {
      const result = [];
      result.push("nextBlock");
      return result;
    } else if (data[0] == "goTrade") {
      const result = [];
      result.push("nextTransaction");
      result.push(data[1]);
      return result;
    }
  }
}

module.exports = { clientData };
