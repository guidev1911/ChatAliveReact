import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

export default function EditProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photoFile, setPhotoFile] = useState(null);

  const backendUrl = "http://192.168.0.11:8080";

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
  }, [user]);

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
      onProfileUpdated(updatedData);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-end justify-start p-4">
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
                maxLength={32}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="text-sm text-gray-400 text-right mt-1">{name.length}/32</div>
          </div>

          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input
              className="w-full p-2 rounded-md bg-[#0f4c5c] text-gray-400 border border-cyan-700 cursor-not-allowed"
              type="email"
              value={user?.email || ""}
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
  );
}
