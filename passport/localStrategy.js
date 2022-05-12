const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");
const bcrypt = require("bcrypt");

const Users = require("../models/users");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await Users.findOne({
            where: {
              email: email,
            },
          });
          if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
              console.log("로그인 완료");
              done(null, user);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
          // 여기 done이 index.js에서 serial부터 아래로 내려 간다.
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
