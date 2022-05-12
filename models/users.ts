import { Model, Optional } from "sequelize";

import { sequelize } from "./index";

interface UserAttributes {
    email: string;
    password: string;
}

export class Users extends Model<UserAttributes> {
    public email!: string;
    public password!: string;
}

Users.init(
    {
        email: {
            primaryKey: true,
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        password: {
            allowNull: true,
            type: DataTypes.STRING(200),
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "Users",
        tableName: "users",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    }
);

// Users.hasMany(Scores, {
//     sourceKey: "id",
//     foreignKey: "user_id",
//     as: "userHasManyScores",
// });
