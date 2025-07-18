import React, { useEffect, useState } from "react";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import EditProfileModal from "../components/EditProfileModal";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backendUrl = "http://localhost:8080";

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
    <div className="min-h-screen flex bg-[#0f4c5c] text-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-[#083344] p-6 flex flex-col border-r border-cyan-700 shadow-lg items-center relative">
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

      {/* Área principal */}
      <main className="flex-1 p-10 bg-[#0a2a32]">
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
