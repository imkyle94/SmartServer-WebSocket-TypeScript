const passport = require("passport");
const local = require("./localStrategy");
const axios = require("axios");

const Users = require("../models/users");

// 세션 저장하는 곳
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  // 사용자 정보에 대한 어떠한 처리를 할 때, 즉, req.user 생성하는 곳
  // 쉽게 말해서 inNotLoggedIn이나 isLoggedin을 매개변수로 적으면 여기로 옴
  // 굳이 serial과 deserial을 나누는 이유를 아직 정확히 모르겠음.
  // 세션 등을 실제 배포에선 이렇게 변수에 저장하지 않고 (서버 재시작 등으로 초기화 되거나 하면 안되기 때문에)
  // 세션또한 db에 저장한다. 대신 mysql이 아닌 메모리기반 redis에 저장을 많이 한다

  passport.deserializeUser(async (email, done) => {
    try {
      // 최종적으로는 이곳에 redis 내용을 써줘야한다
      const user = await Users.findOne({
        where: { email: email },
      });
      done(null, user);
    } catch {
      console.log("deserialize 오류");
    }
  });
  local();
};
