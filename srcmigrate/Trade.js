import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

function Trade() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/apis/trade", data);
      setIsRedirect(true);
      console.log("트레이드 클라이언트 성공");
    } catch (err) {
      console.log("트레이드 클라이언트 실패");
    }
  };

  return (
    <div>
      <h2>Trade</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("address")} placeholder="보내는곳" />
        <input {...register("amount")} placeholder="얼마나" />
        <input type="submit" />
      </form>
      {isRedirect && <Navigate to="/" />}
    </div>
  );
}

export default Trade;
