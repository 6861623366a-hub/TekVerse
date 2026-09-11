export default function ServerList({ servers, currentServer, setCurrentServer, onCreateClick }) {
  return (
    <div className="w-20 bg-gray-850 border-r border-gray-800 overflow-y-auto flex flex-col gap-2 p-2">
      <button
        onClick={onCreateClick}
        className="w-14 h-14 bg-gradient-to-br from-pink-500 to-magenta-500 rounded-full flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition"
        title="Crear servidor"
      >
        +
      </button>
      
      {servers && servers.map((server) => (
        <button
          key={server._id}
          onClick={() => setCurrentServer(server)}
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold transition ${
            currentServer?._id === server._id
              ? 'bg-cyan-500 text-gray-900'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title={server.name}
        >
          {server.icon ? <img src={server.icon} alt={server.name} className="w-full h-full rounded-full" /> : server.name.substring(0, 2)}
        </button>
      ))}
    </div>
  );
}