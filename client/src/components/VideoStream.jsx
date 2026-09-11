import { useEffect, useRef } from 'react';

export default function VideoStream({ stream, muted = false, isSelf = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted || isSelf}
      className="w-full h-full object-cover bg-gray-900 rounded"
    />
  );
}