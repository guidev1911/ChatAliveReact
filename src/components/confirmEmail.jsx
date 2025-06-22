import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [mensagemApi, setMensagemApi] = useState("");

  const inputsRef = useRef([]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value;
    setCodeDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const getCode = () => codeDigits.join("");

  async function handleSubmit(e) {
    e.preventDefault();
    const code = getCode();

    if (code.length < 6) {
      setMensagemApi("Digite os 6 dígitos do código.");
      return;
    }

    setLoading(true);
    setMensagemApi("");

    try {
      const response = await fetch("http://localhost:8080/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.text();

      if (response.ok) {
        navigate("/main"); // redireciona ao sucesso
      } else {
        setMensagemApi("❌ " + result);
      }
    } catch (error) {
      setMensagemApi("Erro de conexão: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-300 px-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded shadow-md w-96 max-w-full">
        <h2 className="text-2xl mb-6 text-green-800 font-bold text-center">Confirmar E-mail</h2>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 mb-6 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
        />

        <div className="flex justify-between mb-6">
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-10 h-12 text-center text-lg font-bold border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-2 rounded ${
            loading
              ? "bg-green-700 cursor-not-allowed opacity-60"
              : "bg-green-900 hover:bg-green-700"
          } text-gray-200 transition`}
        >
          {loading ? "Verificando..." : "Confirmar"}
        </button>

        {mensagemApi && (
          <p className="mt-4 text-center text-sm text-green-400">{mensagemApi}</p>
        )}

        <p className="mt-6 text-center text-gray-400">
          Já confirmou?{" "}
          <Link to="/" className="text-green-600 hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}
