import React, { useEffect, useState } from "react";
import { GearIcon, PersonIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import EditProfileModal from "../components/EditProfileModal";
import { motion, AnimatePresence } from "framer-motion";
import CreateGroupModal from "../components/CreateGroupModal";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("explorar"); // explorar | meus | amigos
  const [groups, setGroups] = useState([]);

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

  useEffect(() => {
    if (activeTab === "explorar") {
      async function fetchGroups() {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await fetch(`${backendUrl}/groups`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Falha ao carregar grupos");
          const data = await response.json();
          setGroups(data.content || []);
        } catch (err) {
          console.error(err);
        }
      }

      fetchGroups();
    }
  }, [activeTab]);

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

      {/* Sidebar desktop */}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              aria-hidden="true"
              onClick={() => setSidebarOpen(false)}
            />

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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
        <main className="flex-1 p-6 md:p-10 bg-white transition-all duration-300">
          {/* Menu de abas com animação de underline */}
          <div className="flex justify-center gap-8 mb-6 border-b border-gray-300 pb-2 relative">
            {["explorar", "meus", "amigos"].map((tab) => (
              <button
                key={tab}
                className={`relative text-gray-700 font-semibold px-2 py-1 transition-all duration-300 ${
                  activeTab === tab ? "text-cyan-600" : "hover:text-cyan-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "explorar" ? "Explorar" : tab === "meus" ? "Meus Grupos" : "Amigos"}
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-cyan-600 rounded"
                  animate={{ opacity: activeTab === tab ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>

          {/* Conteúdo das abas animado */}
          <div className="w-full h-full relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "explorar" && (
                <motion.div
                  key="explorar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {groups.map((group) => (
                    <motion.div
                      key={group.id}
                      className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-white"
                      whileHover={{ scale: 1.03 }}
                    >
                      <h3 className="font-bold text-lg text-cyan-600">{group.name}</h3>
                      <p className="text-gray-600 text-sm">{group.description}</p>
                      <p className="text-gray-400 text-xs mt-2">Privacidade: {group.privacy}</p>
                      <p className="text-gray-400 text-xs mt-1">Criador: {group.creator.name}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "meus" && (
                <motion.div
                  key="meus"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <button
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg transition"
                  >
                    ➕ Criar Grupo
                  </button>
                  <p className="text-gray-500 text-sm mt-2">Você ainda não entrou em nenhum grupo.</p>
                </motion.div>
              )}

              {activeTab === "amigos" && (
                <motion.div
                  key="amigos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <p className="text-gray-500 text-sm mt-2">Seus amigos aparecerão aqui em breve.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

      {/* Modais */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onProfileUpdated={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}


