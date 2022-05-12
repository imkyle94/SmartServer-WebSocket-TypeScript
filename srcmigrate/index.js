import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TestContextProvider from "./TestContext";

// import your route components too

import "./index.css";
import App from "./App";
import Join from "./Join";
import Login from "./Login";
import Logout from "./Logout";
import Apis from "./Apis";
import Make from "./routes/apis/Make";
import Openapi from "./routes/apis/Openapi";
import Block from "./Block";
import Trade from "./Trade";
import Wallet from "./Wallet";

// import Home from "./Home";
// import Teams from "./Teams";
// import Team from "./Teams";
// import NewTeamForm from "./App";
// import LeagueStandings from "./App";

// 네스팅 라우터 요즘은       <Outlet></Outlet> 로 쓴다

import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <TestContextProvider>
      <Routes>
        {/* 라우터 연습 */}
        <Route path="/" element={<App />}></Route>
        <Route path="/join" element={<Join />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/apis" element={<Apis />}>
          <Route path="openapi" element={<Openapi />}></Route>
          <Route path="make" element={<Make />}></Route>
        </Route>
        <Route path="/trade" element={<Trade />}></Route>
        <Route path="/wallet" element={<Wallet />}></Route>
        <Route path="/block" element={<Block />}></Route>

        {/* 경로 없이 라우터 쓸 수 있는데 언제쓰지 */}
        {/* <Route index element={<Home />} /> */}

        {/* <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route> */}
      </Routes>
    </TestContextProvider>
  </BrowserRouter>,

  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
