"use client";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useGroupCall } from "./GroupCallProvider";

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const AVATAR_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-cyan-500",
];

const ParticipantVideo = ({ stream, isLocal, name, videoOn }) => {
  const ref = useRef(null);
  const hasVideo = !!(stream && videoOn);
  const colorIndex = (name || "").length % AVATAR_COLORS.length;

  useEffect(() => {
    if (ref.current && stream && hasVideo) {
      ref.current.srcObject = stream;
      ref.current.play().catch(() => {});
    }
  }, [stream, hasVideo]);

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
      {hasVideo ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
          style={isLocal ? { transform: "scaleX(-1)" } : {}}
        />
      ) : (
        <div className={`w-20 h-20 rounded-full ${AVATAR_COLORS[colorIndex]} flex items-center justify-center text-white text-3xl font-bold`}>
          {(name || "?").charAt(0).toUpperCase()}
        </div>
      )}
      <span className="absolute bottom-2 left-2 text-xs text-white/70 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
        {isLocal ? "You" : (name || "?")}
      </span>
    </div>
  );
};

const ActiveGroupCallBar = () => {
  const { t } = useTranslation();
  const {
    callDuration, isMuted, isCameraOn, isVideo,
    participants, localStreamRef, videoStates,
    toggleMute, toggleCamera, leaveGroupCall, endGroupCall,
  } = useGroupCall();

  const localName = useSelector((s) => s.auth?.user?.name || s.auth?.user?.username || "You");
  const currentUserId = useSelector((s) => s.auth?.user?._id);
  const allParticipants = [
    { id: "local", stream: localStreamRef.current, isLocal: true, name: localName, videoOn: isCameraOn },
    ...participants.filter((p) => p.id !== currentUserId).map((p) => ({ ...p, videoOn: videoStates[p.id] ?? isVideo })),
  ];

  const gridCols = allParticipants.length <= 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3";

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className={`grid ${gridCols} gap-3 h-full`}>
          {allParticipants.map((p) => (
            <ParticipantVideo
              key={p.id}
              stream={p.stream}
              isLocal={p.isLocal}
              name={p.name}
              videoOn={p.videoOn}
            />
          ))}
        </div>
      </div>

      <div className="bg-surface/10 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white text-sm font-medium">
            {formatDuration(callDuration)}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isMuted ? t("Unmute") : t("Mute")}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-all ${
              !isCameraOn ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isCameraOn ? t("Turn off camera") : t("Turn on camera")}
          >
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          <button
            onClick={endGroupCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            title={t("End call")}
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveGroupCallBar;
