import express, { Express, Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import path from "path";

import helmet from "helmet";
import hpp from "hpp";

import { sequelize } from "./models/index";

import cookieParser from "cookie-parser";
import session from "express-session";

import passport from "passport";
import passportConfig from "./passport";

// 라우터 선언
import indexRouter from "./routers/index";
import authRouter from "./routers/auth";
import apisRouter from "./routers/apis/index";
import blockRouter from "./routers/apis/block";

// 모든 URL에 대한 Router
import otherRouter from "./routers/other";

const app: Express = express();

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
const PORT: number = 80;
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
const sessionOption: object = {
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
  // sessionOption.proxy = true;
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
// app.use("/", indexRouter);
// app.use("/auth", authRouter);
// app.use("/apis", apisRouter);
// app.use("/apis/block", blockRouter);

// ERROR 메세지 창
app.use((req: Request, res: Response, next: NextFunction) => {
  // interface Error {
  // status?: number;
  // }
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  // error.status = 404;
  // logger.info("hello");
  // logger.error(error.message);
  next(error);
});

app.use((error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? error : {};
  res.status(error.status || 500);
  res.render("error");
});

app.use(otherRouter);

// PORT 연결상태 확인
app.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}`)
);
