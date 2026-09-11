export default function Sidebar({ user, onProfileClick, onLogout }) {
  return (
    <div className="w-16 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center cursor-pointer font-bold text-lg" title="TekVerse">
        T
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex flex-col gap-2 w-full items-center">
        <img
          src={user?.avatar}
          alt={user?.username}
          className="w-12 h-12 rounded-full cursor-pointer hover:opacity-80"
          onClick={onProfileClick}
          title={user?.username}
        />
        <button
          onClick={onLogout}
          className="w-10 h-10 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded text-red-400 transition"
          title="Cerrar sesión"
        >
          ↪
        </button>
      </div>
    </div>
  );
}