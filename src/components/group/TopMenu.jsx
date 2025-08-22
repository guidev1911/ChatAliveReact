import { motion } from "framer-motion";

export default function TopMenu({ activeTab, setActiveTab }) {
  const tabs = ["explorar", "meus", "amigos"];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-center items-center gap-6 py-3 relative">
        {tabs.map((tab) => (
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
  );
}
