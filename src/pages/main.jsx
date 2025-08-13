import React, { useEffect, useState } from "react";
import { GearIcon, PersonIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import EditProfileModal from "../components/EditProfileModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Controle da sidebar no mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const backendUrl = "http://192.168.0.11:8080";

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/user/profile/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Falha ao carregar perfil");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f4c5c] text-gray-100">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f4c5c] text-red-500 font-semibold">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0f4c5c] text-gray-100 relative">

      {/* Botão mobile para abrir sidebar */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-60 md:hidden p-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg"
        aria-label="Abrir perfil"
        title="Abrir perfil"
      >
        <DotsHorizontalIcon className="w-6 h-6" />
      </button>

      {/* Sidebar desktop fixa */}
      <aside className="hidden md:flex w-80 bg-[#083344] p-6 flex-col border-r border-cyan-700 shadow-lg items-center relative z-50">
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">ChatAlive</h1>

        <div className="w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
          <img
            src={`${backendUrl}${user.photoUrl}`}
            alt="Foto do usuário"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>

        <p className="text-sm text-gray-400 text-center px-4 break-words whitespace-pre-wrap max-w-[260px]">
          {user.bio}
        </p>

        <div className="mt-10 text-sm text-gray-500">Você está conectado.</div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-14 left-4 text-cyan-400 hover:text-cyan-300 transition"
          aria-label="Editar perfil"
          title="Editar perfil"
        >
          <PersonIcon className="w-6 h-6" />
        </button>

        <button
          className="absolute bottom-4 left-4 text-cyan-400 opacity-50 cursor-default"
          aria-label="Configurações"
          title="Configurações (sem ação)"
          tabIndex={-1}
        >
          <GearIcon className="w-6 h-6" />
        </button>
      </aside>

      {/* Sidebar mobile animada */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay sem onClick */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Sidebar deslizante */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#083344] p-6 flex flex-col border-r border-cyan-700 shadow-lg items-center z-50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="self-end mb-4 text-cyan-400 hover:text-cyan-300"
                aria-label="Fechar perfil"
                title="Fechar perfil"
              >
                ✕
              </button>

              <h1 className="text-3xl font-bold text-cyan-400 mb-10">ChatAlive</h1>

              <div className="w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
                <img
                  src={`${backendUrl}${user.photoUrl}`}
                  alt="Foto do usuário"
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>

              <p className="text-sm text-gray-400 text-center px-4 break-words whitespace-pre-wrap max-w-[260px]">
                {user.bio}
              </p>

              <div className="mt-10 text-sm text-gray-500">Você está conectado.</div>

              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setSidebarOpen(false);
                }}
                className="absolute bottom-14 left-4 text-cyan-400 hover:text-cyan-300 transition"
                aria-label="Editar perfil"
                title="Editar perfil"
              >
                <PersonIcon className="w-6 h-6" />
              </button>

              <button
                className="absolute bottom-4 left-4 text-cyan-400 opacity-50 cursor-default"
                aria-label="Configurações"
                title="Configurações (sem ação)"
                tabIndex={-1}
              >
                <GearIcon className="w-6 h-6" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <main
        className={`flex-1 p-10 bg-[#0a2a32] transition-all duration-300 ${
          sidebarOpen ? "opacity-50 pointer-events-none md:opacity-100 md:pointer-events-auto" : ""
        }`}
      >
        <div className="w-full h-full rounded-lg border-2 border-dashed border-cyan-800 flex items-center justify-center text-gray-400">
          Em breve: grupos, mensagens, busca e mais!
        </div>
      </main>

      {/* Modal de edição de perfil */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onProfileUpdated={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}
