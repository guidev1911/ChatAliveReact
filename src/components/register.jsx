import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.text();

      if (!response.ok) {
        alert("Erro ao cadastrar: " + result);
        return;
      }

      // Redireciona para a tela de confirmação passando o email
      navigate("/confirmar", { state: { email } });

    } catch (error) {
      alert("Erro no fetch: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-300 px-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded shadow-md w-96 max-w-full">
        <h2 className="text-2xl mb-6 text-green-800 font-bold text-center">Cadastro</h2>

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-6 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-2 rounded ${
            loading
              ? "bg-green-700 cursor-not-allowed opacity-60"
              : "bg-green-900 hover:bg-green-700"
          } text-gray-200 transition`}
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>

        <p className="mt-6 text-center text-gray-400">
          Já tem conta?{" "}
          <Link to="/" className="text-green-600 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}
