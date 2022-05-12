const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const axios = require("axios");

const Users = require("../models/users");

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  try {
    const { email, password } = await req.body;
    const hash = await bcrypt.hash(password, 12);
    await Users.create({
      email: email,
      password: hash,
    });
    console.log("회원가입 완료");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, async (req, res, next) => {
  try {
    // passport를 이용하면 req.session 객체에 정보를 넣는게 쉬워서 사용하는 것이다.
    // localStrategy로 감
    passport.authenticate("local", (authError, user, info) => {
      // 서버에러 시
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      //req.login이 serializeUser 실행
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.json(user.email);
        // redirect("/")
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  } catch {
    console.log("로그인 오류");
  }
});

router.get("/session", isLoggedIn, (req, res) => {
  res.json(req.user);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("로그아웃 완료");
});

module.exports = router;
