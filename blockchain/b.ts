import events from "events";
import util from "util";
import fs from "fs";
import path from "path";

import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8080");

// clientEvent.emit으로 실행시킨다
const clientEvent = new events.EventEmitter();

clientEvent.on("getBlocks", function () {
    const result: string[] = [];
    result.push("getBlocks");
    client.send(result);
});

clientEvent.on("getLocalData", function () {
    const result: string[] = [];
    result.push("getLocalData");
    client.send(result);
});

clientEvent.on("saveLocalData", function () {
    const result: string[] = [];
    result.push("saveLocalData");
    client.send(result);
});

// 블록에 넣을 트랜잭션 불러오기
clientEvent.on("getTransactions", function (data) {
    const result: string[] = [];
    result.push("getTransactions");
    client.send(result);
});

clientEvent.on("update", function () {
    // 파일 읽어서 마지막 길이를 보내서
    // 업데이트 해야하는지 안해야하는지로 판단하자
    // const length = fs.readFileSync
    const result: string[] = [];
    result.push("update");

    const size = fs.statSync(`./local/${port}.txt`).size;
    result.push(size);

    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("initConnect", function () {
    initBlocks();
    const result: string[] = [];
    result.push("initConnect");
    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("goChaegul", function () {
    const result: string[] = [];
    result.push("goChaegul");
    const result1 = JSON.stringify(result);
    client.send(result1);
});
clientEvent.on("goTrade", function (data) {
    const result: string[] = [];
    result.push("goTrade");
    result.push(data);
    const result1 = JSON.stringify(result);
    client.send(result1);
});

// 여기서부터 보면 댐

clientEvent.on("nextBlock", function () {
    const abcd = getPool();
    const result: string[] = [];

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
    const result: string[] = [];
    result.push("login");

    const local = fs.readFileSync(`./local/${a}.txt`, "utf8", (err) => {});
    // 지금은 다받았는데 그럺필요 없고 길이만 받으면 댐

    result.push(local);
    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("broadcast_findBlock", function (data) {
    const result: string[] = [];
    result.push("broadcast");
    result.push("findBlock");
    result.push(data);
    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("broadcast_validok", function (data) {
    const result: string[] = [];
    result.push("broadcast");
    result.push("validok");
    result.push(data);

    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("broadcast_transaction", function (data) {
    const result: string[] = [];
    result.push("broadcast");
    result.push("transaction");
    result.push(data);

    const result1 = JSON.stringify(result);
    client.send(result1);
});

clientEvent.on("broadcast_validtransactionok", function (data) {
    const result: string[] = [];
    result.push("broadcast");
    result.push("validtransactionok");
    result.push(data);

    const result1 = JSON.stringify(result);
    client.send(result1);
});

const client = new WebSocket("ws://localhost:8080");

let Jh1: string[] = [];
let num: number = 0;
let n1: number = 0;
let n2: number = 0;
let jh: number = 0;

client.on("message", function (data) {
    const dataToString: string = data.toString();

    Jh1 = [];
    jh = 0;
    n1 = 0;
    n2 = 0;
    num = 0;

    for (let i = 0; i < dataToString.length; i++) {
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

    for (let i = 0; i < Jh1.length; i++) {
        const dataParsing: string = JSON.parse(Jh1[i]);

        //  내가 받을 데이터 정제하는곳
        const result: object[] = clientData(data1);
        console.log(result);
    }
});

client.on("end", function () {
    // 블럭을 메모리는 날라가니까
    // const b = fs.sendFile("./local/b.txt", "utf-8");
    console.log("Client Well Exit!");
});
