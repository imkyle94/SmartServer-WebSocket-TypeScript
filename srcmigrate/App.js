import "./App.css";
import React from "react";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { TestContext } from "./TestContext";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();
  const [유저, 유저변경] = useState(false);
  const { email, setEmailHandler } = useContext(TestContext);

  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <h1>프로젝트</h1>
        {email != "" ? (
          <div>
            <h4>{email}님 안녕하세요!</h4>
            <Link to="/logout">로그아웃</Link>
          </div>
        ) : (
          <div>
            <Link to="/join">회원가입</Link> | <Link to="/login">로그인</Link>
          </div>
        )}
        <br></br>
        {email != "" && (
          <div>
            <Link to="/wallet">지갑 생성하기</Link> |{" "}
            <Link to="/trade">거래하기</Link>
          </div>
        )}
        <br></br>
        <Link to="/block">채굴하기</Link>
        <br></br>
        <Link to="/apis">Apis</Link>
      </nav>
    </div>
  );
}

export default App;
