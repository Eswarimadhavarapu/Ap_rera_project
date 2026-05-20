import React from "react";
import { Outlet } from "react-router-dom";

import LegalSidebar from "./LegalSidebar";
import LegalHeader from "./LegalHeader";

const LegalLayout = () => {

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >

      <LegalSidebar />

      <div
        style={{
          flex: 1,
          background: "#f8fafc",
        }}
      >

        <LegalHeader />

        <Outlet />

      </div>

    </div>
  );
};

export default LegalLayout;