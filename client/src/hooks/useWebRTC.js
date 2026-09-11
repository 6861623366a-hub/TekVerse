import { useEffect, useRef, useState } from 'react';

export const useWebRTC = (channelId, userId) => {
  const localStreamRef = useRef(null);
  const peerConnections = useRef({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const startLocalStream = async (audio = true, video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsCameraOn(video);
      setIsMicOn(audio);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleCamera = async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMicrophone = async () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false
      });
      setIsScreenSharing(true);
      return screenStream;
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    setIsScreenSharing(false);
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setIsCameraOn(false);
      setIsMicOn(false);
    }
  };

  return {
    localStream,
    remoteStreams,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    startLocalStream,
    toggleCamera,
    toggleMicrophone,
    startScreenShare,
    stopScreenShare,
    stopLocalStream
  };
};

export default useWebRTC;