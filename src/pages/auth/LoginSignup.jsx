import React from "react";

const LoginSignup = ({ authState }) => {
  return (
    <div>
      <h2>{authState?.from ? "Login" : "Signup"}</h2>
      <p>
        {authState?.from
          ? "Please log in to continue."
          : "Create an account to get started."}
      </p>

      <form action="">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">{authState?.from ? "Login" : "Signup"}</button>
      </form>
    </div>
  );
};

export default LoginSignup;
