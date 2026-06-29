"use client";
import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserId, selectUser } from "@/redux/auth/authSlice";
import { getSocket, initSocket } from "@/services/socketService";
import SimplePeer from "simple-peer";
import { playRing, playAccept, playHangup } from "./callSounds";
import IncomingGroupCall from "./IncomingGroupCall";
import ActiveGroupCallBar from "./ActiveGroupCallBar";

const GroupCallContext = createContext(null);

export const useGroupCall = () => useContext(GroupCallContext);

const GroupCallProvider = ({ children }) => {
  const currentUserId = useSelector(selectUserId);
  const currentUser = useSelector(selectUser);
  const currentUserName = currentUser?.name || currentUser?.username || "Unknown";

  const [groupCallState, setGroupCallState] = useState("idle");
  const [incomingInfo, setIncomingInfo] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [videoStates, setVideoStates] = useState({});

  const currentChatIdRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef(new Map());
  const ringCleanupRef = useRef(null);

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
      setIsCameraOn(withVideo);
      return stream;
    } catch (err) {
      console.error("[GroupCall] getUserMedia error:", err);
      return null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
  }, []);

  const stopRing = useCallback(() => {
    if (ringCleanupRef.current) {
      ringCleanupRef.current();
      ringCleanupRef.current = null;
    }
  }, []);

  const destroyAllPeers = useCallback(() => {
    peersRef.current.forEach((peer) => {
      try { peer.destroy(); } catch (e) { /* ignore */ }
    });
    peersRef.current.clear();
  }, []);

  const cleanupCall = useCallback(() => {
    stopRing();
    stopMedia();
    destroyAllPeers();
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setCallDuration(0);
    setGroupCallState("idle");
    setIncomingInfo(null);
    setIsVideo(false);
    setIsMuted(false);
    setIsCameraOn(false);
    setParticipants([]);
    setVideoStates({});
    currentChatIdRef.current = null;
  }, [stopRing, stopMedia, destroyAllPeers]);

  const createPeer = useCallback((targetUserId, initiator, stream) => {
    if (peersRef.current.has(targetUserId)) {
      try { peersRef.current.get(targetUserId).destroy(); } catch (e) { /* ignore */ }
      peersRef.current.delete(targetUserId);
    }

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
      if (!socket) return;

      if (data.type === "offer") {
        socket.emit("group_call_offer", {
          target_user_id: targetUserId,
          user_id: currentUserId,
          sdp: data,
        });
      } else if (data.type === "answer") {
        socket.emit("group_call_answer", {
          target_user_id: targetUserId,
          user_id: currentUserId,
          sdp: data,
        });
      } else {
        socket.emit("group_call_ice", {
          target_user_id: targetUserId,
          user_id: currentUserId,
          candidate: data,
        });
      }
    });

    peer.on("stream", (remoteStream) => {
      setParticipants((prev) => prev.map((p) => p.id === targetUserId ? { ...p, stream: remoteStream } : p));
    });

    peer.on("connect", () => {
      playAccept();
    });

    peer.on("close", () => {
      peersRef.current.delete(targetUserId);
      setParticipants((prev) => prev.filter((p) => p.id !== targetUserId));
    });

    peer.on("error", () => {
      peersRef.current.delete(targetUserId);
      setParticipants((prev) => prev.filter((p) => p.id !== targetUserId));
    });

    peersRef.current.set(targetUserId, peer);
  }, [currentUserId]);

  useEffect(() => {
    const socket = initSocket(localStorage.getItem("token"));

    const handleIncomingGroupCall = ({ chat_id, is_video, initiator_id, initiator_name }) => {
      console.log("[GroupCall] Received incoming_group_call from", initiator_name, "for chat", chat_id, "state:", groupCallState);
      if (groupCallState !== "idle") {
        console.log("[GroupCall] Ignoring - not idle (state:", groupCallState, ")");
        return;
      }
      currentChatIdRef.current = chat_id;
      setIncomingInfo({ initiator_id, initiator_name, is_video: !!is_video });
      setIsVideo(!!is_video);
      stopRing();
      ringCleanupRef.current = playRing(true);
      setGroupCallState("ringing");
    };

    const handleGroupCallReady = async ({ participants: existing, is_video }) => {
      stopRing();
      setIsVideo(!!is_video);
      const stream = await getMedia(is_video);
      if (!stream) { cleanupCall(); return; }
      setGroupCallState("connected");
      setParticipants(existing.map((p) => ({ id: p.id, stream: null, name: p.name })));
      setVideoStates({ [currentUserId]: !!is_video, ...Object.fromEntries(existing.map((p) => [p.id, !!is_video])) });
      const start = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    };

    const handleGroupCallJoined = async ({ participants: existing, is_video }) => {
      stopRing();
      setIsVideo(!!is_video);
      const stream = await getMedia(is_video);
      if (!stream) { cleanupCall(); return; }
      setGroupCallState("connected");
      setParticipants(existing.map((p) => ({ id: p.id, stream: null, name: p.name })));
      setVideoStates({ [currentUserId]: !!is_video, ...Object.fromEntries(existing.map((p) => [p.id, !!is_video])) });
      const start = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - start) / 1000));
      }, 1000);
      existing.forEach((p) => createPeer(p.id, false, stream));
    };

    const handleParticipantJoined = ({ user_id, name }) => {
      if (groupCallState !== "connected" || user_id === currentUserId) return;
      setParticipants((prev) => {
        if (prev.find((p) => p.id === user_id)) return prev;
        return [...prev, { id: user_id, stream: null, name }];
      });
      setVideoStates((prev) => ({ ...prev, [user_id]: isVideo }));
      const stream = localStreamRef.current;
      if (!stream) return;
      createPeer(user_id, true, stream);
    };

    const handleVideoState = ({ user_id, video_on }) => {
      setVideoStates((prev) => ({ ...prev, [user_id]: video_on }));
    };

    const handleParticipantLeft = ({ user_id }) => {
      const peer = peersRef.current.get(user_id);
      if (peer) {
        try { peer.destroy(); } catch (e) { /* ignore */ }
        peersRef.current.delete(user_id);
      }
      setParticipants((prev) => prev.filter((p) => p.id !== user_id));
    };

    const handleGroupCallEnded = () => {
      playHangup();
      cleanupCall();
    };

    const handleOffer = async ({ user_id, sdp }) => {
      if (groupCallState !== "connected") return;
      let peer = peersRef.current.get(user_id);
      if (!peer) {
        const stream = localStreamRef.current;
        if (!stream) return;
        createPeer(user_id, false, stream);
        peer = peersRef.current.get(user_id);
      }
      if (peer) peer.signal(sdp);
    };

    const handleAnswer = ({ user_id, sdp }) => {
      const peer = peersRef.current.get(user_id);
      if (peer) peer.signal(sdp);
    };

    const handleIce = ({ user_id, candidate }) => {
      const peer = peersRef.current.get(user_id);
      if (peer) peer.signal(candidate);
    };

    socket.on("incoming_group_call", handleIncomingGroupCall);
    socket.on("group_call_ready", handleGroupCallReady);
    socket.on("group_call_joined", handleGroupCallJoined);
    socket.on("group_call_participant_joined", handleParticipantJoined);
    socket.on("group_call_participant_left", handleParticipantLeft);
    socket.on("group_call_ended", handleGroupCallEnded);
    socket.on("group_call_offer", handleOffer);
    socket.on("group_call_answer", handleAnswer);
    socket.on("group_call_ice", handleIce);
    socket.on("group_call_video_state", handleVideoState);

    return () => {
      socket.off("incoming_group_call", handleIncomingGroupCall);
      socket.off("group_call_ready", handleGroupCallReady);
      socket.off("group_call_joined", handleGroupCallJoined);
      socket.off("group_call_participant_joined", handleParticipantJoined);
      socket.off("group_call_participant_left", handleParticipantLeft);
      socket.off("group_call_ended", handleGroupCallEnded);
      socket.off("group_call_offer", handleOffer);
      socket.off("group_call_answer", handleAnswer);
      socket.off("group_call_ice", handleIce);
      socket.off("group_call_video_state", handleVideoState);
    };
  }, [groupCallState, getMedia, createPeer, cleanupCall, stopRing]);

  const initiateGroupCall = useCallback(async (chatId, video = false) => {
    if (groupCallState !== "idle") return;
    console.log("[GroupCall] Initiating group call for chat", chatId);
    currentChatIdRef.current = chatId;
    setIsVideo(video);
    stopRing();
    ringCleanupRef.current = playRing(true);
    setGroupCallState("connecting");
    const socket = getSocket();
    if (socket?.connected) {
      console.log("[GroupCall] Socket connected, emitting group_call_initiate");
      socket.emit("group_call_initiate", { chat_id: chatId, caller_name: currentUserName, is_video: video });
    } else {
      console.warn("[GroupCall] Socket not connected");
      cleanupCall();
    }
  }, [groupCallState, currentUserName, cleanupCall, stopRing]);

  const joinGroupCall = useCallback(async () => {
    const stream = await getMedia(incomingInfo?.is_video);
    if (!stream) return;
    const socket = getSocket();
    if (socket && currentChatIdRef.current) {
      socket.emit("group_call_join", { chat_id: currentChatIdRef.current, caller_name: currentUserName });
    }
    setIncomingInfo(null);
  }, [incomingInfo, getMedia, currentUserName]);

  const declineGroupCall = useCallback(() => {
    stopRing();
    playHangup();
    cleanupCall();
  }, [cleanupCall, stopRing]);

  const leaveGroupCall = useCallback(() => {
    const socket = getSocket();
    if (socket && currentChatIdRef.current) {
      socket.emit("group_call_leave", { chat_id: currentChatIdRef.current });
    }
    playHangup();
    cleanupCall();
  }, [cleanupCall]);

  const endGroupCall = useCallback(() => {
    const socket = getSocket();
    if (socket && currentChatIdRef.current) {
      socket.emit("group_call_end", { chat_id: currentChatIdRef.current });
    }
    playHangup();
    cleanupCall();
  }, [cleanupCall]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const toggleCamera = useCallback(async () => {
    if (!localStreamRef.current) return;
    const existingTrack = localStreamRef.current.getVideoTracks()[0];
    if (existingTrack) {
      existingTrack.enabled = !existingTrack.enabled;
      setIsCameraOn(existingTrack.enabled);
      const socket = getSocket();
      if (socket && currentChatIdRef.current) {
        socket.emit("group_call_video_toggle", { chat_id: currentChatIdRef.current, video_on: existingTrack.enabled });
      }
      return;
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      const videoTrack = newStream.getVideoTracks()[0];
      if (!videoTrack) return;
      localStreamRef.current.addTrack(videoTrack);
      peersRef.current.forEach((peer, userId) => {
        try {
          const pc = peer._pc;
          if (pc && pc.addTrack) {
            pc.addTrack(videoTrack, localStreamRef.current);
          }
        } catch (e) {
          console.warn("[GroupCall] Failed to add video track to peer", userId, e.message);
        }
      });
      setIsCameraOn(true);
      const socket = getSocket();
      if (socket && currentChatIdRef.current) {
        socket.emit("group_call_video_toggle", { chat_id: currentChatIdRef.current, video_on: true });
      }
    } catch (err) {
      console.error("[GroupCall] Failed to get video:", err);
    }
  }, []);

  const value = {
    groupCallState,
    incomingInfo,
    isVideo,
    callDuration,
    isMuted,
    isCameraOn,
    participants,
    videoStates,
    initiateGroupCall,
    joinGroupCall,
    declineGroupCall,
    leaveGroupCall,
    endGroupCall,
    toggleMute,
    toggleCamera,
    localStreamRef,
  };

  return (
    <GroupCallContext.Provider value={value}>
      {children}
      <audio id="group-call-audio" autoPlay />
      {groupCallState === "ringing" && <IncomingGroupCall />}
      {groupCallState === "connected" && <ActiveGroupCallBar />}
    </GroupCallContext.Provider>
  );
};

export default GroupCallProvider;
export { GroupCallContext };
