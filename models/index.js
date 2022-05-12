const path = require("path");
const Sequelize = require("sequelize");

// Model 불러오기
const Users = require("./users");
const Blocks = require("./blocks");
const Transactions = require("./transactions");

const env = process.env.NODE_ENV || "development";

// MySQL connection setting
const config = require("../config/config.js");
// const config = require("../config/config.json")[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// db 객체에 모든 테이블 넣기
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Users = Users;
db.Blocks = Blocks;
db.Transactions = Transactions;

// MySQL에 모델 넣기
Users.init(sequelize);
Blocks.init(sequelize);
Transactions.init(sequelize);

// 관계 설정
Users.associate(db);
Blocks.associate(db);
Transactions.associate(db);

module.exports = db;
