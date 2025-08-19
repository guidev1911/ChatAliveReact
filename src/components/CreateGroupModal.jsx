import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

export default function CreateGroupModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateGroup = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await fetch("http://192.168.0.11:8080/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, privacy }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Erro ao criar grupo");
      }

      setName("");
      setDescription("");
      setPrivacy("PUBLIC");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-end justify-start p-4">

          <motion.div
            className="fixed inset-0 backdrop-blur-sm bg-black/5"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

            {/* Modal */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-0 flex items-center justify-center z-50"
            >
            <div className="bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] w-11/12 max-w-md sm:max-w-sm p-6 relative">
              {/* Botão X */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-cyan-600 font-bold text-lg"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-cyan-600 mb-4">
                Criar novo grupo
              </h2>

              {/* Área de conteúdo */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do grupo"
                  className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white text-gray-700"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição"
                  className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none bg-white text-gray-700"
                  rows={3}
                />
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full px-4 py-2 border border-cyan-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none bg-white text-gray-700"
                >
                  <option value="PUBLIC">Público</option>
                  <option value="PRIVATE">Privado</option>
                  <option value="CLOSED">Fechado</option>
                </select>
              </div>

              {/* Erro */}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Botão de criar */}
                <button
                onClick={handleCreateGroup}
                disabled={loading}
                className="mt-6 w-full py-2 text-sm sm:text-base bg-gradient-to-r from-cyan-400 to-cyan-600
                            hover:from-cyan-700 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300
                            disabled:opacity-50 shadow-lg"
                >
                {loading ? "Criando..." : "Criar grupo"}
                </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}