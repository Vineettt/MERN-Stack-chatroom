/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

const SignInMenu = ({ logout }) => {
  return (
    <li onClick={logout}>
      <a href="#">Logout</a>
    </li>
  );
};

export default SignInMenu;
