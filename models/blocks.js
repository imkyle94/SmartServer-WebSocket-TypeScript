const Sequelize = require("sequelize");

module.exports = class Blocks extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
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
  }

  // 테이블간 관계 설정
  static associate(db) {
    db.Blocks.hasMany(db.Transactions, {
      foreignKey: "index",
      sourceKey: "index",
    });
  }
};
