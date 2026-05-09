"use client";
import React, { useState } from "react";
import { X, Users, Download, Archive, UserPlus, UserMinus, Shield } from "lucide-react";
import {
  useArchiveChatMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation
} from "@/redux/conversations/conversationsAPI";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { RootRoute } from "@/Root.Route";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useIsAlertOpen } from "@/store/alertStore";

const ChatDetailsModal = ({ activeChat, onClose }) => {
  const currentUser = useSelector(selectUser);
  const [archiveChat, { isLoading: isArchiving }] = useArchiveChatMutation();
  const [removeParticipant] = useRemoveParticipantMutation();
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
  // We would normally fetch all system users to add participants,
  // but for simplicity we'll just show the UI structure here.

  const isSubscriber = currentUser?.type === "Subscriber" || currentUser?.role === "Admin";
  const isGroup = activeChat.isGroup;

  const handleArchive = async () => {
    try {
      await archiveChat({ chatId: activeChat._id, is_archived: !activeChat.is_archived }).unwrap();
      onClose();
    } catch (err) {
      setApiResponse({ isOpen: true, status: "error", message: "Failed to archive chat" });
    }
  };

  const handleExport = () => {
    if (!isSubscriber) {
      setApiResponse({ isOpen: true, status: "error", message: "You don't have permission to export chats." });
      return;
    }
    // Trigger download
    const token = localStorage.getItem("token");
    window.open(`${RootRoute}/api/chats/${activeChat._id}/export?token=${token}`, "_blank");
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      await removeParticipant({ chatId: activeChat._id, userId }).unwrap();
    } catch (err) {
      setApiResponse({ isOpen: true, status: "error", message: "Failed to remove participant" });
    }
  };

  const isAlertOpen = useIsAlertOpen();

  return (
    <>
    {!isAlertOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-status-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-cell-primary">Chat Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-weak-100 rounded-full text-sub-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col items-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 overflow-hidden border-2"
            style={{ 
              backgroundColor: 'var(--color-blue-ebf1ff)',
              color: 'var(--color-primary)',
              borderColor: 'var(--status-border)'
            }}
          >
            {activeChat.image ? (
              <img src={activeChat.image} alt={activeChat.title} className="w-full h-full object-cover" />
            ) : (
              (activeChat.title || activeChat.participants_ids?.find(p => p._id !== currentUser?._id)?.name || "C").charAt(0).toUpperCase()
            )}
          </div>
          <h3 className="text-xl font-bold text-cell-primary mb-1">
            {activeChat.title || activeChat.participants_ids?.find(p => p._id !== currentUser?._id)?.name || "Direct Chat"}
          </h3>
          <p className="text-sm text-sub-500 mb-6">{isGroup ? "Group Chat" : "Direct Chat"}</p>

          <div className="w-full space-y-2">
            <h4 className="text-sm font-bold text-cell-secondary uppercase tracking-wider mb-3 px-1">Actions</h4>
            
            <button 
              onClick={handleArchive}
              disabled={isArchiving}
              className="w-full flex items-center gap-3 p-3 bg-weak-50 hover:bg-weak-100 rounded-xl text-cell-primary font-medium transition-colors border border-status-border"
            >
              <Archive size={18} className="text-sub-500" />
              {activeChat.is_archived ? "Unarchive Chat" : "Archive Chat"}
            </button>

            {isSubscriber && (
              <button 
                onClick={handleExport}
                className="w-full flex items-center gap-3 p-3 bg-weak-50 hover:bg-weak-100 rounded-xl text-cell-primary font-medium transition-colors border border-status-border"
              >
                <Download size={18} className="text-sub-500" />
                Export Chat History
              </button>
            )}

            {isGroup && (
              <div className="mt-6 pt-4 border-t border-status-border">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-sm font-bold text-cell-secondary uppercase tracking-wider">Participants</h4>
                  <button className="text-primary hover:text-primary-600 text-sm font-medium flex items-center gap-1">
                    <UserPlus size={14} /> Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {activeChat.participants?.map((participant) => (
                    <div key={participant._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-weak-50 border border-transparent hover:border-status-border transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {participant.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-cell-primary">{participant.name}</p>
                          <p className="text-[10px] text-sub-500">{participant.email}</p>
                        </div>
                      </div>
                      
                      {isSubscriber && participant._id !== currentUser?._id && (
                        <button 
                          onClick={() => handleRemoveParticipant(participant._id)}
                          className="p-1.5 text-sub-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )}

    <ApiResponseAlert
      isOpen={apiResponse.isOpen}
      status={apiResponse.status}
      message={apiResponse.message}
      onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
    />
    </>
  );
};

export default ChatDetailsModal;
