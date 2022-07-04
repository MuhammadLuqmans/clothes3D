import { useState } from "react";

export default function Header() {
  return (
    <header>
      <div
        style={{
          height: "60px",
          backgroundColor: "black",
          color: "#f9d10f",
          padding: "1rem 2rem",
          borderBottom: "3px solid #f1b13b",
          // boxShadow: "0px 2px 2px 0px rgba(0,0,0,0.5)"
        }}
      >
        <div className="logo">
          <span
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "1.3rem",
            }}
          >
            3dlamoda
          </span>
        </div>
      </div>
    </header>
  );
}
