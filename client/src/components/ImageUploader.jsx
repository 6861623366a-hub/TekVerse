import { useState } from 'react';
import { messageAPI } from '../api';

export default function ImageUploader({ channelId, onImageUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // En un proyecto real, esto subiría a Cloudinary o similar
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload({
          url: event.target.result,
          filename: file.name,
          size: file.size,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer text-gray-400 hover:text-cyan-500 transition"
        title={uploading ? 'Subiendo...' : 'Compartir archivo'}
      >
        📎
      </label>
    </div>
  );
}