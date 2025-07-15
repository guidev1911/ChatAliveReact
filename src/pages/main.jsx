import React, { useEffect, useState } from "react";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (!response.ok) {
          throw new Error("Falha ao carregar perfil");
        }

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
      {/* Sidebar esquerda */}
      <aside className="w-80 bg-[#083344] p-6 flex flex-col border-r border-cyan-700 shadow-lg items-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-10">ChatAlive</h1>

        {/* Foto de perfil */}
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-md mb-4">
          <img
            src={`${backendUrl}${user.photoUrl}`} 
            alt="Foto do usuário"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Nome do usuário */}
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>

        {/* Bio */}
        <p className="text-sm text-gray-400 text-center px-4">{user.bio}</p>

        <div className="mt-10 text-sm text-gray-500">
          Você está conectado.
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 p-10 bg-[#0a2a32]">
        <div className="w-full h-full rounded-lg border-2 border-dashed border-cyan-800 flex items-center justify-center text-gray-400">
          Em breve: grupos, mensagens, busca e mais!
        </div>
      </main>
    </div>
  );
}
