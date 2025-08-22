import { AnimatePresence, motion } from "framer-motion";
import { PersonIcon, GearIcon, ExitIcon } from "@radix-ui/react-icons";

export default function MobileSidebar({ isOpen, onClose, backendUrl, user, onEdit, onLogout }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            aria-hidden="true"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-[#083344] p-6 flex flex-col border-r border-cyan-700 shadow-lg items-center z-50 overflow-y-auto md:hidden"
          >
            <button
              onClick={onClose}
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
            <h2 className="text-xl font-semibold mb-2 text-center">{user.name}</h2>
            <p className="text-sm text-gray-400 text-center px-4 break-words whitespace-pre-wrap max-w-[260px]">
            {user.bio}
            </p>

            <button
              onClick={onEdit}
              className="absolute bottom-24 left-4 text-cyan-400 hover:text-cyan-300 transition"
              aria-label="Editar perfil"
              title="Editar perfil"
            >
              <PersonIcon className="w-6 h-6" />
            </button>

            <button
              className="absolute bottom-14 left-4 text-cyan-400 opacity-50 cursor-default"
              aria-label="Configurações"
              title="Configurações (sem ação)"
              tabIndex={-1}
            >
              <GearIcon className="w-6 h-6" />
            </button>

            <button
              onClick={onLogout}
              className="absolute bottom-4 left-4 text-red-400 hover:text-red-300 transition"
              aria-label="Sair"
              title="Sair"
            >
              <ExitIcon className="w-6 h-6" />
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
