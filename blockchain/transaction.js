const CryptoJS = require("crypto-js");
const ecdsa = require("elliptic");
const ec = new ecdsa.ec("secp256k1");

const { generatePrivatekey } = require("./encryption");

class TxOut {
  //주소와 코인의 양으로 구성
  constructor(address, amount) {
    this.address = address;
    this.amount = amount;
  }
}

class TxIn2 {
  //코인이 어디로부터 왔는지에 대한 정보를 제공
  constructor(txOutId, txOutIndex) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
  }
}

class TxIn {
  //코인이 어디로부터 왔는지에 대한 정보를 제공
  constructor(txOutId, txOutIndex, signature) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.signature = signature;
  }
}

class Transaction {
  constructor(id, txIns, txOuts) {
    this.id = id;
    this.txIns = txIns;
    this.txOuts = txOuts;
  }
}

//트랜잭션 아이디는 트랜잭션의 컨텐트로부터 계산된 해시값
const getTransactionId = (transaction) => {
  const txInContent = transaction.txIns
    .map((txIn) => txIn.txOutId + txIn.txOutIndex)
    .reduce((a, b) => a + b, "");

  const txOutContent = transaction.txOuts
    .map((txOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, "");

  // return { txInContent, txOutContent };
  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

function getTransactionId2(data1, data2) {
  const q1 = [data1.txOutId, data1.txOutIndex];
  const cd1 = q1.reduce((a, b) => a + b);

  const q2 = [data2.address, data2.amount];
  const cd2 = q2.reduce((a, b) => a + b);

  return CryptoJS.SHA256(cd1 + cd2).toString();
}

function getTransactionId3(transaction) {
  const q1 = [transaction.txIns.txOutId, transaction.txIns.txOutIndex];
  const cd1 = q1.reduce((a, b) => a + b);

  const q2 = [transaction.txOuts.address, transaction.txOuts.amount];
  const cd2 = q2.reduce((a, b) => a + b);

  return CryptoJS.SHA256(cd1 + cd2).toString();
}

const toHexString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

function signTxIn(data, k) {
  //시그니쳐만들기함수
  // const txIn = transaction.txIns[txInIndex];
  const dataToSign = data;
  // const referencedUnspentTxOut = findUnspentTxOut(
  //   txIn.txOutId,
  //   txIn.txOutIndex,
  //   aUnspentTxOuts
  // );
  // const referencedAddress = referencedUnspentTxOut.address;
  const privateKey = k;
  const key = ec.keyFromPrivate(privateKey, "hex");
  const signature = toHexString(key.sign(dataToSign).toDER());
  return signature;
}

const findUnspentTxOut = (transactionId, index, aUnspentTxOuts) => {
  return aUnspentTxOuts.find(
    (uTxO) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index
  );
};

class UnspentTxOut {
  //uTxO  구조
  constructor(txOutId, txOutIndex, address, amount) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;
  }
}
let unspentTxOuts = []; //uTxO의 목록의 자료구조는 단순한 배열

//새로운 블록이 더해질 때마다 uTxO(Unspent transaction outputs)을 업데이트
const updateUnspentTxOuts = (newTransactions, aUnspentTxOuts) => {
  const newUnspentTxOuts = newTransactions
    .map((t) => {
      return t.txOuts.map(
        (txOut, index) =>
          new UnspentTxOut(t.id, index, txOut.address, txOut.amount)
      );
    })
    .reduce((a, b) => a.concat(b), []);

  //이미 소비된 트랜잭션 아웃풋 확인  새 트랜잭션의 인풋을 검사하면 알 수 있어요.
  const consumedTxOuts = newTransactions
    .map((t) => t.txIns)
    .reduce((a, b) => a.concat(b), [])
    .map((txIn) => new UnspentTxOut(txIn.txOutId, txIn.txOutIndex, "", 0));

  const resultingUnspentTxOuts = aUnspentTxOuts
    .filter(
      //사용된 아웃풋?
      (uTxO) => !findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts)
    )
    .concat(newUnspentTxOuts);

  return resultingUnspentTxOuts;
};

function makeTransaction(txin, txout, key) {
  const a1 = new TxIn2(txin[0], txin[1]);
  const a2 = new TxOut(txout.address, txout.amount);

  const trId = getTransactionId2(a1, a2);
  const sign = signTxIn(trId, key);

  const b = new TxIn(txin[0], txin[1], sign);
  const bbb = new Transaction(trId, b, a2);

  return bbb;
}

// function validateTxIn() {}

function isValidTransactionStructure(transaction) {
  if (typeof transaction.id !== "string") {
    console.log("transactionId missing");
    return false;
  }
  return true;
}

function checkValidTransaction(transaction) {
  isValidTransactionStructure(transaction);
  if (getTransactionId3(transaction) !== transaction.id) {
    console.log("invalid tx id: " + transaction.id);
    return false;
  }
  return true;
}

module.exports = { makeTransaction, checkValidTransaction };
