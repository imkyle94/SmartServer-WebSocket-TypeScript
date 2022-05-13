import dotenv from "dotenv";
dotenv.config();

import path from "path";

if (!process.env.MYSQL_HOST) {
    dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

export const config = {
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS,
    port: process.env.MYSQL_PORT || "3306",
    database: process.env.MYSQL_DB || "TSC",
    dialect: "mysql",
};
