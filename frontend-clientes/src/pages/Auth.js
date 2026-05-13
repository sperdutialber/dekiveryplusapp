import React from "react";
import RegistroForm from "../components/RegistroForm";
import LoginForm from "../components/LoginForm";

function Auth() {
  return (
    <div>
      <h2>Autenticacion</h2>
      <div className="auth-grid">
        <RegistroForm />
        <LoginForm />
      </div>
    </div>
  );
}

export default Auth;
