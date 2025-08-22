import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/profile/EditProfileModal";
import { motion, AnimatePresence } from "framer-motion";
import CreateGroupModal from "../components/group/CreateGroupModal";
import MobileSidebarButton from "../components/sideBar/MobileSidebarButton";
import DesktopSidebar from "../components/sideBar/DesktopSidebar";
import MobileSidebar from "../components/sideBar/MobileSidebar";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("explorar"); 
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const backendUrl = "http://192.168.0.11:8080";

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    navigate("/");
  };

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
    <div className="flex min-h-screen bg-[#0f4c5c] text-gray-100 relative">

      {/* Botão mobile */}
      <MobileSidebarButton onClick={() => setSidebarOpen(true)} />

      {/* Sidebar desktop */}
      <DesktopSidebar
        user={user}
        backendUrl={backendUrl}
        onEdit={() => setIsModalOpen(true)}
        onLogout={handleLogout}  
      />

      {/* Sidebar mobile */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user} 
        backendUrl={backendUrl} 
        onEdit={() => setIsModalOpen(true)} 
        onLogout={handleLogout}  
      />

      {/* Menu fixo no topo (desktop) */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-center items-center gap-6 py-3 relative">
          {["explorar", "meus", "amigos"].map((tab) => (
            <button
              key={tab}
              className="relative text-base font-semibold px-4 py-2 text-gray-700 hover:text-cyan-500 transition-all duration-300"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "explorar" ? "Explorar" : tab === "meus" ? "Meus Grupos" : "Amigos"}
              {activeTab === tab && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-cyan-600 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo principal rolável */}
      <main className="flex-1 p-4 md:p-10 bg-white mt-[60px] overflow-y-auto overflow-x-hidden">
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


