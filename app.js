const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
const path = require("path");

const { sequelize } = require("./models/index.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const passport = require("passport");
const passportConfig = require("./passport");

// 라우터 선언
const indexRouter = require("./routers/index.js");
const authRouter = require("./routers/auth");
const apisRouter = require("./routers/apis/index");
const blockRouter = require("./routers/apis/block");
// 모든 URL에 대한 Router
const otherRouter = require("./routers/other.js");

const app = express();

// DB와 연결
sequelize
  // sync : MySQL에 테이블이 존재 하지 않을때 생성
  //      force: true   => 이미 테이블이 있으면 drop하고 다시 테이블 생성
  .sync({ force: false })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });

// PORT setting
const PORT = 80;
app.set("port", process.env.PORT || PORT);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.use("/", express.static(path.join(__dirname, "./build")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// req.session 객체 생성
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  // redis저장 설정
  // store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));

// passport setting
passportConfig();
// passport 설정 선언(req에 passport 설정 삽입) 위 use.session이라고 보면 댐
app.use(passport.initialize());
// req.session 에 passport 정보 저장 (req.session.num = 1 이런거라고 보면 댐)
app.use(passport.session());

// URL과 라우터 매칭
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/apis", apisRouter);
app.use("/apis/block", blockRouter);

// ERROR 메세지 창
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  // logger.info("hello");
  // logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.use(otherRouter);

// PORT 연결상태 확인
app.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);
