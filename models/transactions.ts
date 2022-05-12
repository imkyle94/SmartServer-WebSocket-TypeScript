import { Model, Optional } from "sequelize";

import { sequelize } from "./index";
import { Blocks } from "./blocks";

interface TransactionAttributes {
    index: number;
    id2: string;
    txOutId: string;
    txOutIndex: number;
    signature: string;
    address: string;
    amount: string;
}

export class Transactions extends Model<TransactionAttributes> {
    public index!: number;
    public id2!: string;
    public txOutId!: string;
    public txOutIndex!: number;
    public signature!: string;
    public address!: string;
    public amount!: string;
}

Transactions.init(
    {
        index: {
            //   primarKey: true,
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        id2: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        txOutId: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        txOutIndex: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        signature: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        address: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        amount: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "Transactions",
        tableName: "transactions",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

Transactions.belongsTo(Blocks, {
    foreignKey: "index",
    sourceKey: "index",
});
