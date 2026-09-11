export default function MembersList({ members, server }) {
  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-bold text-gray-300 uppercase">Miembros ({members?.length || 0})</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {members && members.map((member) => (
          <div
            key={member.user?._id}
            className="px-3 py-2 rounded hover:bg-gray-700 transition flex items-center gap-2 cursor-pointer"
          >
            <img
              src={member.user?.avatar}
              alt={member.user?.username}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{member.user?.username}</p>
              <p className="text-xs text-gray-400">{member.role}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${
              member.user?.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`}></span>
          </div>
        ))}
      </div>
    </div>
  );
}