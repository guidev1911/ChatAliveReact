import { PersonIcon, GearIcon, ExitIcon } from "@radix-ui/react-icons";

export default function DesktopSidebar({ user, onEdit, backendUrl, onLogout }) {
  return (
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

      {/* Rodapé com botões */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-4">
        <button
          onClick={onEdit}
          className="text-cyan-400 hover:text-cyan-300 transition"
          aria-label="Editar perfil"
          title="Editar perfil"
        >
          <PersonIcon className="w-6 h-6" />
        </button>

        <button
          className="text-cyan-400 opacity-50 cursor-default"
          aria-label="Configurações"
          title="Configurações (sem ação)"
          tabIndex={-1}
        >
          <GearIcon className="w-6 h-6" />
        </button>

        <button
          onClick={onLogout}
          className="text-red-400 hover:text-red-300 transition"
          aria-label="Sair"
          title="Sair"
        >
          <ExitIcon className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}
