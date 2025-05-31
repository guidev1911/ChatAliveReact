import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        alert("Erro ao cadastrar");
        return;
      }

      alert("Cadastro realizado com sucesso! Faça login.");
      navigate("/");
    } catch (error) {
      alert("Erro no fetch: " + error.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-300">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-6 text-green-800 font-bold text-center">Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded bg-gray-700 text-gray-200"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-gray-700 text-gray-200"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-900 hover:bg-green-700 text-gray-200 font-bold py-2 rounded"
        >
          Cadastrar
        </button>
        <p className="mt-4 text-center text-gray-400">
          Já tem conta?{" "}
          <Link to="/" className="text-green-600 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}
