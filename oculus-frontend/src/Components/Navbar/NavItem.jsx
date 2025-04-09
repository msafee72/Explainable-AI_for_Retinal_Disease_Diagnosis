import React from "react";
import { NavLink } from "react-router-dom";
export default function NavItem(props) {
  return (
    <>
      <NavLink
        to={props.to}
        className={({ isActive }) =>
          `custome-link ${isActive ? "active-class" : ""} `
        }
      >
        {props.label}
      </NavLink>
    </>
  );
}
