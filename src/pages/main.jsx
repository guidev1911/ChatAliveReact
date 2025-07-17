import React, { useEffect, useState } from "react";

export default function Main() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhoto, setEditPhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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
        setEditName(data.name);
        setEditBio(data.bio);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    if (editName) formData.append("name", editName);
    if (editBio) formData.append("bio", editBio);
    if (editPhoto) formData.append("photoFile", editPhoto);

    try {
      const response = await fetch(`${backendUrl}/user/profile/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      setSuccessMessage("Perfil atualizado com sucesso");
      setIsEditing(false);

      // Recarrega perfil atualizado
      const profileRes = await fetch(`${backendUrl}/user/profile/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedData = await profileRes.json();
      setUser(updatedData);
      setEditName(updatedData.name);
      setEditBio(updatedData.bio);
      setEditPhoto(null);
    } catch (err) {
      setError(err.message);
    }
  };

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
            src={
              editPhoto
                ? URL.createObjectURL(editPhoto)
                : `${backendUrl}${user.photoUrl}`
            }
            alt="Foto do usuário"
            className="w-full h-full object-cover"
          />
        </div>

        {isEditing ? (
          <>
            <input
              type="file"
              onChange={(e) => setEditPhoto(e.target.files[0])}
              className="mb-2 text-sm"
            />
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mb-2 px-2 py-1 rounded bg-[#0f4c5c] text-white w-full"
              placeholder="Nome"
            />
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="px-2 py-1 rounded bg-[#0f4c5c] text-white w-full"
              rows={3}
              placeholder="Bio"
            />
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-1 bg-green-600 rounded hover:bg-green-700"
            >
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 text-sm text-red-400 hover:text-red-500"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            {/* Nome do usuário */}
            <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
            {/* Bio */}
            <p className="text-sm text-gray-400 text-center px-4">{user.bio}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-3 py-1 bg-cyan-600 rounded hover:bg-cyan-700"
            >
              Editar perfil
            </button>
          </>
        )}

        {successMessage && (
          <p className="mt-4 text-green-400 text-sm">{successMessage}</p>
        )}
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
