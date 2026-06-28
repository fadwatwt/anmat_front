"use client";
import { useTranslation } from "react-i18next";
import { PhoneOff, Video } from "lucide-react";
import { useCall } from "./CallProvider";

const OutgoingCall = () => {
  const { t } = useTranslation();
  const { callerInfo, hangupCall, callState, isVideoCall } = useCall();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center animate-scale-in border border-status-border">
        <div className="w-20 h-20 rounded-full bg-primary-500 dark:bg-primary-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
          {isVideoCall ? (
            <Video size={28} className="text-white dark:text-black" />
          ) : (
            <span className="text-3xl font-bold text-white dark:text-black">
              {callerInfo?.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-cell-primary mb-1">{callerInfo?.name || t("Unknown")}</h2>
        <p className="text-sub-500 text-sm mb-8 flex items-center justify-center gap-2">
          {isVideoCall && <Video size={16} />}
          {callState === "connecting" ? t("Connecting...") : t("Calling...")}
        </p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={hangupCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <PhoneOff size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCall;
