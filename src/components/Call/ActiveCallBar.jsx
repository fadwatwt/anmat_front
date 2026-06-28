"use client";
import { useTranslation } from "react-i18next";
import { PhoneOff, Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { useCall } from "./CallProvider";

const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const ActiveCallBar = () => {
  const { t } = useTranslation();
  const { callerInfo, callDuration, isMuted, isVideoCall, isCameraOn, toggleMute, toggleCamera, hangupCall } = useCall();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-status-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
            <Phone size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-cell-primary">
              {callerInfo?.name || t("Call")}
            </p>
            <p className="text-[11px] text-green-500 font-medium">
              {formatDuration(callDuration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted
                ? "bg-red-500 text-white"
                : "bg-weak-50 text-sub-500 hover:bg-status-bg"
            }`}
            title={isMuted ? t("Unmute") : t("Mute")}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {isVideoCall && (
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full transition-all ${
                !isCameraOn
                  ? "bg-red-500 text-white"
                  : "bg-weak-50 text-sub-500 hover:bg-status-bg"
              }`}
              title={isCameraOn ? t("Turn off camera") : t("Turn on camera")}
            >
              {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          )}

          <button
            onClick={hangupCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
            title={t("Hang up")}
          >
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallBar;
