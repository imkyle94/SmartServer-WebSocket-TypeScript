import path from "path";

import Sequelize from "sequelize";

// Model 불러오기
import Users from "./users";
import Blocks from "./blocks";
import Transactions from "./transactions";

const env: string = process.env.NODE_ENV || "development";

// MySQL connection setting
import config from "../config/config";

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

// db 객체에 모든 테이블 넣기
const db: object = {
    Sequelize = Sequelize,
    sequelize = sequelize,
    Users = Users,
    Blocks = Blocks,
    Transactions = Transactions,
};

// MySQL에 모델 넣기
Users.init(sequelize);
Blocks.init(sequelize);
Transactions.init(sequelize);

// 관계 설정
Users.associate(db);
Blocks.associate(db);
Transactions.associate(db);

export { db };
