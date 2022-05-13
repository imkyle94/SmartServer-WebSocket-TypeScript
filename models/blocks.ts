import { Model, Optional, DataTypes } from "sequelize";

import { sequelize } from "./index";

import { Transactions } from "./transactions";

interface BlockAttributes {
    version: string;
    index: number;
    previousHash: string;
    timestamp: number;
    merkleRoot: string;
    difficulty: number;
    nonce: number;
}

export class Blocks extends Model<BlockAttributes> {
    public version!: string;
    public index!: number;
    public previousHash!: string;
    public timestamp!: number;
    public merkleRoot!: string;
    public difficulty!: number;
    public nonce!: number;
}

Blocks.init(
    {
        version: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },
        index: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        previousHash: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },
        timestamp: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        merkleRoot: {
            allowNull: true,
            type: DataTypes.STRING(500),
        },
        difficulty: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        nonce: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "Blocks",
        tableName: "blocks",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

console.log(Blocks);

// Blocks.hasMany(Transactions, {
//     foreignKey: "index",
//     sourceKey: "index",
// });
