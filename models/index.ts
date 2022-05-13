import path from "path";
import fs from "fs";

import { Sequelize, DataTypes } from "sequelize";

const db: any = {};
const basename = path.basename(__filename);

const env: string = process.env.NODE_ENV || "development";

// MySQL connection setting
import { config } from "../config/config";

console.log("hi");
console.log(__dirname);

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: "mysql",
    }
);

fs.readdirSync(__dirname)
    .filter((file: string) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".ts"
        );
    })
    .forEach((file: any) => {
        // const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        const model = import(path.join(__dirname, file)).then(
            (a) => (db[file] = a)
        );
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export { db, sequelize };
