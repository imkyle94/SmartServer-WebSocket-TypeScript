import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { TestContext } from "./TestContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();
  const { email, setEmailHandler } = useContext(TestContext);

  const onSubmit = async (data) => {
    try {
      const data1 = await axios.post("http://localhost:8080/auth/logout", data);

      setEmailHandler("");
      setIsRedirect(true);

      console.log("로그아웃 클라이언트 성공");
    } catch (err) {
      console.log("로그아웃 클라이언트 실패");
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("logout")} placeholder="로그아웃하기" />
        <input type="submit" />
      </form>
      {isRedirect && <Navigate to="/" />}
    </div>
  );
}

export default Logout;
