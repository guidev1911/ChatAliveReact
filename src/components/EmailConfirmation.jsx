import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function EmailConfirmation({ email, onBackToLogin }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.11:8080/auth/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao confirmar código.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        onBackToLogin();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [success, onBackToLogin]);

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">
      Confirme seu email
    </h2>

    {success ? (
      <div className="text-cyan-400 text-center">
        <p>Email confirmado com sucesso!</p>
        <p className="text-sm text-gray-300 mt-1">Redirecionando para o login...</p>
        <button
          onClick={onBackToLogin}
          className="mt-4 text-cyan-300 underline hover:text-cyan-200"
        >
          Ir agora
        </button>
      </div>
    ) : (
      <form onSubmit={handleConfirm} className="space-y-5">
        <p className="text-gray-300 text-sm text-center">
          Digite o código de 6 dígitos enviado para <strong>{email}</strong>
        </p>

        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de verificação"
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />

        {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-[#0891B2] to-[#06B6D4] hover:from-[#0e7490] hover:to-[#22d3ee] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 shadow-lg"
        >
          {loading ? "Confirmando..." : "Confirmar"}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full text-sm text-gray-300 underline mt-4"
        >
          Voltar para o login
        </button>
      </form>
    )}
  </motion.div>
);
}