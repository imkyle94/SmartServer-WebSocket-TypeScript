import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { TestContext } from "./TestContext";
import { Navigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

// 받기만하는 소켓도 하나 만들어두면
// 이제 프론트 역할을 해줄 거 같은데?

// 새로 알았네
// net을 브라우저에서는 못쓴다
// 막아뒀네 아하 이유가 뭘까
// 계층 공부하면서 연결될 내용이겠다

const URL = "http://localhost:8080";

function Block() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();
  const { email, setEmailHandler } = useContext(TestContext);

  function a() {
    setIsRedirect(true);
  }

  const onSubmit1 = async (data) => {
    try {
      const data = await axios.post(URL + "/apis/block/initConnect");
      console.log("초기연결 클라이언트 성공");
    } catch (err) {
      console.log("초기연결 클라이언트 실패");
    }
  };
  const onSubmit2 = async (data) => {
    try {
      const data = await axios.post(URL + "/apis/block/initWallet", {
        email: email,
      });

      console.log("초기지갑 클라이언트 성공");
    } catch (err) {
      console.log("초기지갑 클라이언트 실패");
    }
  };
  const onSubmit3 = async (data) => {
    try {
      const data = await axios.post(URL + "/apis/block/Chaegul");
      console.log("채굴 클라이언트 성공");
    } catch (err) {
      console.log("채굴 클라이언트 실패");
    }
  };
  const onSubmit4 = async (data) => {
    try {
      await axios.post(URL + "/apis/block/initTrade", data);
      console.log("트레이드 클라이언트 성공");
    } catch (err) {
      console.log("트레이드 클라이언트 실패");
    }
  };

  return (
    <div>
      <h1>채굴하기</h1>

      <form onSubmit={handleSubmit(onSubmit1)}>
        <input {...register("initConnect")} placeholder="처음 연결하기" />
        <input type="submit" />
      </form>
      <br></br>

      <form onSubmit={handleSubmit(onSubmit2)}>
        <input {...register("initWallet")} placeholder="처음 지갑 만들기" />
        <input type="submit" />
      </form>
      <br></br>

      <form onSubmit={handleSubmit(onSubmit3)}>
        <input {...register("Chaegul")} placeholder="채굴하기" />
        <input type="submit" />
      </form>
      <br></br>

      <form onSubmit={handleSubmit(onSubmit4)}>
        <input {...register("address")} placeholder="보내는곳" />
        <input {...register("amount")} placeholder="얼마나" />
        <input type="submit" />
      </form>

      <button onClick={a}>처음으로 가기</button>

      {isRedirect && <Navigate to="/" />}
    </div>
  );
}

export default Block;
