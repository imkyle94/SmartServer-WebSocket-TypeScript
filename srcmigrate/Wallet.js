import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

function Wallet() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/apis/wallet", data);
      setIsRedirect(true);
      console.log("월렛 클라이언트 성공");
    } catch (err) {
      console.log("월렛 클라이언트 실패");
    }
  };

  return (
    <div>
      <h2>Wallet</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="이메일" />

        <input type="submit" />
      </form>
      {isRedirect && <Navigate to="/" />}
    </div>
  );
}

export default Wallet;
