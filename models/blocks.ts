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
            type: Sequelize.STRING(500),
        },
        index: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        previousHash: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        timestamp: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        merkleRoot: {
            allowNull: true,
            type: Sequelize.STRING(500),
        },
        difficulty: {
            allowNull: true,
            type: Sequelize.INTEGER,
        },
        nonce: {
            allowNull: true,
            type: Sequelize.INTEGER,
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

Blocks.hasMany(Transactions, {
    foreignKey: "index",
    sourceKey: "index",
});
