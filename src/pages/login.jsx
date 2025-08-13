import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgImage from "../assets/bg-login.jpg"; 
import PasswordRecovery from "../components/PasswordRecovery";
import ParticlesBackground from "../components/ParticlesBackground";
import UserRegister from "../components/UserRegister";

export default function Login() {
  const [formMode, setFormMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://192.168.0.11:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLoading(false);

      if (data.token) {
        localStorage.setItem("token", data.token);
        remember
          ? localStorage.setItem("rememberedEmail", email)
          : localStorage.removeItem("rememberedEmail");
        navigate("/main");
      } else {
        setError("Login realizado, mas token não encontrado na resposta");
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      setError("Erro de conexão com o servidor");
      setLoading(false);
    }
  };

return (
  <div
    className="h-safe pt-safe-top pb-safe-bottom flex items-center justify-center relative bg-cover bg-center"
    style={{
      backgroundImage: `url(${bgImage})`,
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0"></div>
    <ParticlesBackground />

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl
                p-6 sm:p-10 max-w-xs sm:max-w-md w-full border border-white/20"
    >
      {formMode === "login" ? (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 drop-shadow">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-sm sm:text-base">
            <div>
              <label htmlFor="email" className="block text-white mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30
                          focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-1 font-medium">
                Senha
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30
                          focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
              />
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-white">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-cyan-500"
                />
                <span>Lembrar login</span>
              </label>
              <button
                type="button"
                onClick={() => setFormMode("recover")}
                className="text-cyan-400 hover:underline text-xs sm:text-sm"
              >
                Esqueceu a senha?
              </button>
            </div>

            {error && <p className="text-red-500 text-xs sm:text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-cyan-600
                        hover:from-cyan-700 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 shadow-lg"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-gray-300 text-xs sm:text-sm mt-4 sm:mt-6">
            Novo por aqui?{" "}
            <button
              type="button"
              onClick={() => setFormMode("register")}
              className="text-cyan-400 hover:underline font-semibold"
            >
              Cadastre-se
            </button>
          </p>
        </>
      ) : formMode === "recover" ? (
        <PasswordRecovery onBackToLogin={() => setFormMode("login")} />
      ) : (
        <UserRegister onBackToLogin={() => setFormMode("login")} />
      )}
    </motion.div>
  </div>
);
}