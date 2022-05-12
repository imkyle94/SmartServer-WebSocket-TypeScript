const Sequelize = require("sequelize");

module.exports = class Transactions extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
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
  }

  // 테이블간 관계 설정
  static associate(db) {
    db.Transactions.belongsTo(db.Blocks, {
      foreignKey: "index",
      sourceKey: "index",
    });
  }
};
