// 여기서 json화를 연습해보자
// 엔드포인트 장소를 /url로 하는건 고정이야

import { Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import axios from "axios";

// 보여주기식이 세상에서 제일 싫다
function MakeDBScheme() {
  // 블록을 가져올 수도, 어떠한 파일을 읽을 수도 있다 왜냐 짜놨으니까

  const [isRedirect, setIsRedirect] = useState(false);
  const [블록, 블록변경] = useState([]);
  const [배열블록, 배열블록변경] = useState([]);
  const { register, handleSubmit } = useForm();
  const { register2, handleSubmit2 } = useForm();
  const a = `<input type="submit" />`;
  //   여기에는 .txt파일 저장하는 걸 할거야
  //   여기서 드는 생각이 요청에 파라미터를 신경써야하나? 이거 한번 생각해보자
  const onSubmit = async (data) => {
    try {
      const data2 = await axios.post("http://localhost:3001/apis/make", data);
      let i = 0;
      for (i = 0; i < data2.data.length; i++) {
        배열블록변경((배열블록) => [...배열블록, data2.data[i]]);
      }
      // setEnters((enters) => [...enters, textValue]);
      // 블록변경("123213");
      // console.log(블록);

      // 여기에 그 폼을 나타내주는 테이블 만드는 처리를 하고 싶은데
      // 스크립트에 대한 처리를 백에서 가지고 올까?
      // 아니면 프론트에 미리 만들어둘까?
      console.log("Openapi 성공");
    } catch (err) {
      console.log("Openapi 실패");
    }
  };

  const onSubmit2 = async (data) => {
    try {
      const data2 = await axios.post("http://localhost:3001/apis/make2", data);
      console.log("이거나와야해");
    } catch (err) {
      console.log("Openapi 실패");
    }
  };

  return (
    <div>
      <h2>MakeDBScheme</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("button")} value="1" type="submit"></input>
        <input {...register("password")} placeholder="블록 파일 불러오기" />
      </form>

      {/* 읽어온 블럭을 나타내주는 걸 작성을 해야하고 */}
      {/* 그때 data 형식 처리에 대한 폼을 같이 넣을 거야 */}

      {/* {tr} */}
      {/* {배열블록} */}
      <div dangerouslySetInnerHTML={{ __html: 배열블록 }}></div>
      {/* {a} */}
      {/* {{ data2 } ? { data2 } : null} */}

      {/* 얜 최종제출 */}
      {/* {isRedirect && <Navigate to="/" />} */}
    </div>
  );
}

export default MakeDBScheme;
