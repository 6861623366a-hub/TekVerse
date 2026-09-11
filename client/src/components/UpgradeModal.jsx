export default function UpgradeModal({ onClose, onUpgrade }) {
  const tiers = [
    {
      name: 'Pro',
      price: '$4.99',
      perks: ['🎬 HD Streaming', '✨ Estado personalizado', '📤 100MB uploads']
    },
    {
      name: 'Elite',
      price: '$9.99',
      perks: ['🎬 HD Streaming', '✨ Estado personalizado', '📤 500MB uploads', '🆘 Soporte prioritario']
    },
    {
      name: 'Supreme',
      price: '$19.99',
      perks: ['🎬 HD Streaming 4K', '✨ Estado personalizado', '📤 Uploads ilimitados', '⚡ Acceso temprano', '🆘 Soporte VIP']
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-400">Mejorar a Tier Premium</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:border-cyan-500 transition"
            >
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-2xl font-bold text-cyan-400 mb-4">{tier.price}/mes</p>
              <ul className="space-y-2 mb-4">
                {tier.perks.map((perk, idx) => (
                  <li key={idx} className="text-sm text-gray-300">{perk}</li>
                ))}
              </ul>
              <button
                onClick={() => onUpgrade(tier.name.toLowerCase())}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 rounded transition"
              >
                Mejorar a {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}