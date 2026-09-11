export default function GameLinker({ user, onGameLinked }) {
  const handleLinkGame = async (e) => {
    e.preventDefault();
    const gameId = e.target.gameId.value;
    const gameName = e.target.gameName.value;
    const accountId = e.target.accountId.value;

    try {
      await fetch(`/api/users/${user.id}/link-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, gameName, accountId })
      });
      onGameLinked();
    } catch (error) {
      console.error('Error linking game:', error);
    }
  };

  const popularGames = ['Valorant', 'CS:GO', 'League of Legends', 'Dota 2', 'Fortnite', 'Minecraft', 'Rust'];

  return (
    <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
      <h4 className="font-semibold text-white mb-3">Vincular Juegos</h4>
      <form onSubmit={handleLinkGame} className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Juego</label>
          <select
            name="gameName"
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
            required
          >
            <option value="">Selecciona un juego</option>
            {popularGames.map((game) => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">ID de Cuenta</label>
          <input
            type="text"
            name="accountId"
            placeholder="Tu ID de cuenta"
            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
            required
          />
        </div>
        <input type="hidden" name="gameId" value="game-id" />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-semibold transition"
        >
          Vincular Juego
        </button>
      </form>

      {user.linkedGames && user.linkedGames.length > 0 && (
        <div className="mt-4">
          <h5 className="text-xs font-semibold text-gray-300 mb-2">Juegos Vinculados</h5>
          <div className="space-y-1">
            {user.linkedGames.map((game) => (
              <div key={game.gameId} className="text-xs text-gray-400">
                🎮 {game.gameName}: {game.accountId}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}