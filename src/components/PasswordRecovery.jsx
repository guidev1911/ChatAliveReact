import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PasswordRecovery({ onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const animation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 },
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Erro ao enviar o código.");
      } else {
        setMessage("Código enviado com sucesso. Verifique seu email.");
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Erro ao redefinir senha.");
      } else {
        setMessage("Senha redefinida com sucesso!");
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

return (
  <div>
    <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">
      Recuperar Senha
    </h2>

    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.form
          key="step1"
          onSubmit={handleSendCode}
          {...animation}
          className="space-y-6"
        >
          <div>
            <label className="block text-white mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite seu email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-[#0891B2] to-[#06B6D4] hover:from-[#0e7490] hover:to-[#22d3ee] text-white font-bold rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </motion.form>
      )}

      {step === 2 && (
        <motion.form
          key="step2"
          onSubmit={handleConfirmCode}
          {...animation}
          className="space-y-6"
        >
          <div>
            <label className="block text-white mb-1 font-medium">Código de Verificação</label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Digite o código"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-white mb-1 font-medium">Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nova senha"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <div>
            <label className="block text-white mb-1 font-medium">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme a senha"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition duration-300 shadow-lg disabled:opacity-50"
          >
            {loading ? "Confirmando..." : "Confirmar nova senha"}
          </button>
        </motion.form>
      )}

      {step === 3 && (
        <motion.div key="step3" {...animation} className="text-center text-cyan-300 text-sm">
          <p>{message || "Senha redefinida com sucesso!"}</p>
          <button
            onClick={onBackToLogin}
            className="mt-4 text-cyan-400 hover:underline"
          >
            Voltar para login
          </button>
        </motion.div>
      )}
    </AnimatePresence>

    {(message || error) && step !== 3 && (
      <p
        className={`text-sm mt-4 text-center ${
          error ? "text-red-400" : "text-cyan-300"
        }`}
      >
        {error || message}
      </p>
    )}

    {step !== 3 && (
      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full text-sm text-cyan-300 hover:underline mt-6"
      >
        Voltar para login
      </button>
    )}
  </div>
);
}