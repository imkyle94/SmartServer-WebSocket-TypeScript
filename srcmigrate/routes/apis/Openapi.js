// 여기서 json화를 연습해보자
// 엔드포인트 장소를 /url로 하는건 고정이야

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

function Openapi() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();

  //   여기에는 .txt파일 저장하는 걸 할거야
  //   여기서 드는 생각이 요청에 파라미터를 신경써야하나? 이거 한번 생각해보자
  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3001/apis/openapi", data);
      console.log("Openapi 성공");
    } catch (err) {
      console.log("Openapi 실패");
    }
  };

  return (
    <div>
      <h2>Openapi</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("index")} placeholder="블록 인덱스" />
        <input {...register("password")} placeholder="거래자" />
        <input {...register("to")} placeholder="구매자(받는사람)" />
        <input {...register("from")} placeholder="판매자(보내는사람)" />
        <input type="submit" />
      </form>
      {/* {isRedirect && <Navigate to="/" />} */}
    </div>
  );
}

export default Openapi;
