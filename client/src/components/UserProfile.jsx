import { useState } from 'react';
import { userAPI } from '../api';

export default function UserProfile({ user, onClose }) {
  const [profile, setProfile] = useState(user);
  const [editing, setEditing] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(user._id, profile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleUpgradeTier = async (tier) => {
    try {
      await userAPI.upgradeTier(user._id, tier);
      setSelectedTier(null);
    } catch (error) {
      console.error('Error upgrading tier:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700">
        <div className="relative">
          {profile.banner && (
            <div className="h-32 bg-cover" style={{ backgroundImage: `url(${profile.banner})` }}></div>
          )}
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="flex gap-4 mb-4">
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-16 h-16 rounded-full border-4 border-gray-800"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.username}</h2>
              <p className="text-sm text-cyan-400 uppercase">{profile.role}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded p-3 mb-4">
            <p className="text-sm font-semibold text-cyan-300">Tier Actual: {profile.tiers?.current || 'free'}</p>
            <p className="text-xs text-gray-400">Perks: {profile.tiers?.perks?.join(', ') || 'Ninguno'}</p>
          </div>

          {!selectedTier ? (
            <>
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Bio"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-cyan-500 text-white px-3 py-2 rounded text-sm">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-sm text-gray-300 mb-4">{profile.bio}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm mb-3"
                  >
                    Editar Perfil
                  </button>
                </>
              )}

              {profile.role !== 'founder' && (
                <button
                  onClick={() => setSelectedTier(true)}
                  className="w-full bg-gradient-to-r from-pink-500 to-magenta-500 hover:from-pink-600 hover:to-magenta-600 text-white px-3 py-2 rounded text-sm"
                >
                  Mejorar Tier
                </button>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {['pro', 'elite', 'supreme'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleUpgradeTier(tier)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm capitalize"
                >
                  {tier}
                </button>
              ))}
              <button
                onClick={() => setSelectedTier(null)}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}