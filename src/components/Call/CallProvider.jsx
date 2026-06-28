"use client";
import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserId, selectUser } from "@/redux/auth/authSlice";
import { getSocket, initSocket } from "@/services/socketService";
import SimplePeer from "simple-peer";
import { playRing, playAccept, playHangup } from "./callSounds";
import IncomingCall from "./IncomingCall";
import OutgoingCall from "./OutgoingCall";
import ActiveCallBar from "./ActiveCallBar";

const CallContext = createContext(null);

export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const currentUserId = useSelector(selectUserId);
  const currentUser = useSelector(selectUser);
  const currentUserName = currentUser?.name || currentUser?.username || "Unknown";
  const [callState, setCallState] = useState("idle");
  const [callerInfo, setCallerInfo] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const currentChatIdRef = useRef(null);
  const currentTargetUserIdRef = useRef(null);
  const ringCleanupRef = useRef(null);
  const durationRef = useRef(0);
  const isVideoCallRef = useRef(false);

  const getMedia = useCallback(async (withVideo = false) => {
    if (localStreamRef.current) {
      const hasVideo = localStreamRef.current.getVideoTracks().length > 0;
      if (hasVideo === withVideo) return localStreamRef.current;
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo,
      });
      localStreamRef.current = stream;
      if (withVideo && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }
      return stream;
    } catch (err) {
      console.error("[Call] getUserMedia error:", err);
      return null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }, []);

  const cleanupPeer = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  }, []);

  const stopRing = useCallback(() => {
    if (ringCleanupRef.current) {
      ringCleanupRef.current();
      ringCleanupRef.current = null;
    }
  }, []);

  const cleanupCall = useCallback(() => {
    stopRing();
    cleanupPeer();
    stopMedia();
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setCallDuration(0);
    durationRef.current = 0;
    currentChatIdRef.current = null;
    currentTargetUserIdRef.current = null;
    setCallerInfo(null);
    setIsMuted(false);
    setIsVideoCall(false);
    setIsCameraOn(false);
    isVideoCallRef.current = false;
  }, [cleanupPeer, stopMedia, stopRing]);

  const createPeer = useCallback((initiator, stream) => {
    const peer = new SimplePeer({
      initiator,
      stream,
      trickle: true,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data) => {
      const socket = getSocket();
      if (!socket || !currentTargetUserIdRef.current) return;

      if (data.type === "offer") {
        socket.emit("call_offer", {
          target_user_id: currentTargetUserIdRef.current,
          sdp: data,
        });
      } else if (data.type === "answer") {
        socket.emit("call_answer", {
          target_user_id: currentTargetUserIdRef.current,
          sdp: data,
        });
      } else {
        socket.emit("ice_candidate", {
          target_user_id: currentTargetUserIdRef.current,
          candidate: data,
        });
      }
    });

    peer.on("stream", (remoteStream) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(() => {});
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }
    });

    peer.on("connect", () => {
      stopRing();
      playAccept();
      setCallState("connected");
      const start = Date.now();
      durationIntervalRef.current = setInterval(() => {
        const d = Math.floor((Date.now() - start) / 1000);
        setCallDuration(d);
        durationRef.current = d;
      }, 1000);
    });

    peer.on("close", () => {
      playHangup();
      setCallState("idle");
      cleanupCall();
    });

    peer.on("error", (err) => {
      console.error("[Call] Peer error:", err.message);
      playHangup();
      setCallState("idle");
      cleanupCall();
    });

    return peer;
  }, [cleanupCall, stopRing]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = initSocket(token);

    const handleIncomingCall = ({ chat_id, caller_id, caller_name, is_video }) => {
      if (callState !== "idle") {
        socket.emit("call_busy", { target_user_id: caller_id, chat_id });
        return;
      }
      currentChatIdRef.current = chat_id;
      currentTargetUserIdRef.current = caller_id;
      setCallerInfo({ name: caller_name });
      isVideoCallRef.current = !!is_video;
      setIsVideoCall(!!is_video);
      stopRing();
      ringCleanupRef.current = playRing(true);
      setCallState("ringing");
    };

    const handleCallAccepted = async () => {
      stopRing();
      playAccept();
      setCallState("connecting");
      const stream = await getMedia(isVideoCallRef.current);
      if (!stream) return;
      const peer = createPeer(true, stream);
      peerRef.current = peer;
    };

    const handleCallOffer = async ({ sdp }) => {
      if (callState !== "ringing" && callState !== "connecting") return;
      const stream = await getMedia(isVideoCallRef.current);
      if (!stream) return;
      const peer = createPeer(false, stream);
      peerRef.current = peer;
      peer.signal(sdp);
    };

    const handleCallAnswer = ({ sdp }) => {
      if (!peerRef.current) return;
      peerRef.current.signal(sdp);
    };

    const handleIceCandidate = ({ candidate }) => {
      if (!peerRef.current) return;
      peerRef.current.signal(candidate);
    };

    const handleCallHangup = () => {
      stopRing();
      playHangup();
      cleanupCall();
      setCallState("idle");
    };

    const handleCallDecline = () => {
      stopRing();
      playHangup();
      cleanupCall();
      setCallState("idle");
    };

    const handleCallBusy = () => {
      stopRing();
      playHangup();
      cleanupCall();
      setCallState("idle");
    };

    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);
    socket.on("call_offer", handleCallOffer);
    socket.on("call_answer", handleCallAnswer);
    socket.on("ice_candidate", handleIceCandidate);
    socket.on("call_hangup", handleCallHangup);
    socket.on("call_decline", handleCallDecline);
    socket.on("call_busy", handleCallBusy);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_offer", handleCallOffer);
      socket.off("call_answer", handleCallAnswer);
      socket.off("ice_candidate", handleIceCandidate);
      socket.off("call_hangup", handleCallHangup);
      socket.off("call_decline", handleCallDecline);
      socket.off("call_busy", handleCallBusy);
    };
  }, [callState, getMedia, createPeer, cleanupCall, stopRing]);

  const initiateCall = useCallback(async (chatId, targetUserId, targetUserName, isVideo = false) => {
    if (callState !== "idle") return;

    currentChatIdRef.current = chatId;
    currentTargetUserIdRef.current = targetUserId;
    setCallerInfo({ name: targetUserName });
    isVideoCallRef.current = isVideo;
    setIsVideoCall(isVideo);
    setIsCameraOn(isVideo);

    const stream = await getMedia(isVideo);
    if (!stream) {
      setCallState("idle");
      return;
    }

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("call_initiate", {
        chat_id: chatId,
        target_user_id: targetUserId,
        caller_id: currentUserId,
        caller_name: currentUserName,
        is_video: isVideo,
      });
      stopRing();
      ringCleanupRef.current = playRing(true);
      setCallState("calling");
    } else {
      console.warn("[Call] Socket not connected, cannot initiate call");
      setCallState("idle");
    }
  }, [callState, currentUserId, currentUserName, getMedia, stopRing]);

  const acceptCall = useCallback(async () => {
    const socket = getSocket();
    if (socket && currentTargetUserIdRef.current) {
      socket.emit("call_accept", {
        target_user_id: currentTargetUserIdRef.current,
      });
    }
    setIsCameraOn(isVideoCallRef.current);
    await getMedia(isVideoCallRef.current);
    stopRing();
    setCallState("connecting");
  }, [getMedia, stopRing]);

  const declineCall = useCallback(() => {
    const socket = getSocket();
    if (socket && currentTargetUserIdRef.current) {
      socket.emit("call_decline", {
        target_user_id: currentTargetUserIdRef.current,
        chat_id: currentChatIdRef.current,
      });
    }
    stopRing();
    playHangup();
    cleanupCall();
    setCallState("idle");
  }, [cleanupCall, stopRing]);

  const hangupCall = useCallback(() => {
    const socket = getSocket();
    if (socket && currentTargetUserIdRef.current) {
      socket.emit("call_hangup", {
        target_user_id: currentTargetUserIdRef.current,
        chat_id: currentChatIdRef.current,
        duration: durationRef.current,
      });
    }
    stopRing();
    playHangup();
    cleanupCall();
    setCallState("idle");
  }, [cleanupCall, stopRing]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  }, []);

  const value = {
    callState,
    callerInfo,
    callDuration,
    isMuted,
    isVideoCall,
    isCameraOn,
    initiateCall,
    acceptCall,
    declineCall,
    hangupCall,
    toggleMute,
    toggleCamera,
  };

  return (
    <CallContext.Provider value={value}>
      {children}
      <audio ref={remoteAudioRef} autoPlay />
      {isVideoCall && (
        <>
          <video ref={remoteVideoRef} autoPlay playsInline className="fixed inset-0 z-40 w-full h-full object-cover bg-black" />
          <video ref={localVideoRef} autoPlay playsInline muted className="fixed bottom-24 right-4 z-50 w-48 h-36 object-cover rounded-xl shadow-2xl border-2 border-white/30 bg-gray-900" style={{ transform: 'scaleX(-1)' }} />
        </>
      )}
      {(callState === "calling" || callState === "connecting") && <OutgoingCall />}
      {callState === "ringing" && <IncomingCall />}
      {callState === "connected" && <ActiveCallBar />}
    </CallContext.Provider>
  );
};

export default CallProvider;
