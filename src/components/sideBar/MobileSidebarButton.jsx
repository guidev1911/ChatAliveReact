import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function MobileSidebarButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-0 z-60 w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md flex items-center justify-center rounded-r-full"
      aria-label="Abrir perfil"
      title="Abrir perfil"
    >
      <DotsHorizontalIcon className="w-5 h-5" />
    </button>
  );
}
