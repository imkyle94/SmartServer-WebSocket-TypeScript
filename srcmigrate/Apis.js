import "./App.css";
import React from "react";
import { Outlet, Link } from "react-router-dom";

function Apis() {
  return (
    <div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <h1>APIS</h1>
        <Link to="/apis/openapi">Openapi</Link> |{" "}
        <Link to="/apis/make">Make</Link>
      </nav>
      <Outlet></Outlet>
    </div>
  );
}

export default Apis;
