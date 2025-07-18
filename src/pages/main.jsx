import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons"; 

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

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
        setName(data.name);
        setBio(data.bio);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleUpdateProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (photoFile) {
      formData.append("photoFile", photoFile);
    }

    try {
      const response = await fetch(`${backendUrl}/user/profile/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil");

      const updatedResponse = await fetch(`${backendUrl}/user/profile/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedData = await updatedResponse.json();
      setUser(updatedData);
      setName(updatedData.name);
      setBio(updatedData.bio);
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  }

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

        {/*botão de perfil - abre modal */}
        <button
          onClick={() => setIsModalOpen(true)} 
          className="absolute bottom-14 left-4 text-cyan-400 hover:text-cyan-300 transition"
          aria-label="Editar perfil"
          title="Editar perfil"
        >
          <PersonIcon className="w-6 h-6" />
        </button>

        {/* Botão de engrenagem - sem ação por enquanto */}
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

      {/* Modal de Edição */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 flex items-end justify-start p-4"
      >
        <Dialog.Panel className="bg-[#083344] border border-cyan-800 rounded-lg p-6 shadow-xl w-80">
          <Dialog.Title className="text-cyan-300 font-bold text-lg mb-4">
            Editar Perfil
          </Dialog.Title>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Nome</label>
              <input
                className="w-full p-2 rounded-md bg-[#0f4c5c] text-white border border-cyan-700 focus:outline-none"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Email</label>
              <input
                className="w-full p-2 rounded-md bg-[#0f4c5c] text-gray-400 border border-cyan-700 cursor-not-allowed"
                type="email"
                value={user.email}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300">Bio</label>
              <textarea
                className="w-full p-2 rounded-md bg-[#0f4c5c] text-white border border-cyan-700 focus:outline-none 
                  resize-none break-words whitespace-pre-wrap"
                rows={4}
                maxLength={139}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="text-sm text-gray-400 text-right mt-1">{bio.length}/139</div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Nova foto</label>
              <input
                className="w-full text-sm text-gray-200 file:mr-2 file:p-1 file:bg-cyan-600 file:text-white file:rounded"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md"
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
