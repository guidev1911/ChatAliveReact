import React, { useState } from "react";
import { motion } from "framer-motion";
import EmailConfirmation from "./EmailConfirmation";

export default function UserRegister({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.11:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Erro ao confirmar código.");
        setLoading(false);
        return;
      }

      setRegisteredEmail(email);
      setConfirmationStep(true);
      setLoading(false);

    } catch (err) {
      setError("Erro de conexão com o servidor.");
      setLoading(false);
    }
  };

return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow">
      Cadastro
    </h2>

    {confirmationStep ? (
      <EmailConfirmation
        email={registeredEmail}
        onBackToLogin={onBackToLogin}
      />
    ) : (
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="text-white block mb-1">Nome</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="text-white block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="text-white block mb-1">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div>
          <label className="text-white block mb-1">Confirmar Senha</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-cyan-500 to-cyan-800 hover:from-[#0e7490] hover:to-[#22d3ee] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 shadow-lg"
        >
          {loading ? "Registrando..." : "Cadastrar"}
        </button>

        <p className="text-center text-gray-300 text-sm mt-4">
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-cyan-500 hover:underline font-semibold"
          >
            Entrar
          </button>
        </p>
      </form>
    )}
  </motion.div>
);
}
