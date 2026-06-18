"use client";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X, Users, Download, Archive, UserPlus, UserMinus, Search, ChevronDown, ChevronUp, Check } from "lucide-react";
import {
  useArchiveChatMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation
} from "@/redux/conversations/conversationsAPI";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { RootRoute } from "@/Root.Route";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useIsAlertOpen } from "@/store/alertStore";

const ChatDetailsModal = ({ activeChat, onClose }) => {
  const { t } = useTranslation();
  const currentUser = useSelector(selectUser);
  const [archiveChat, { isLoading: isArchiving }] = useArchiveChatMutation();
  const [addParticipants, { isLoading: isAdding }] = useAddParticipantsMutation();
  const [removeParticipant] = useRemoveParticipantMutation();
  const { data: allEmployees = [] } = useGetEmployeesQuery();

  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
  const [removingId, setRemovingId] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState([]);

  const isSubscriber = currentUser?.type === "Subscriber" || currentUser?.role === "Admin";
  const isGroup = activeChat?.is_group || activeChat?.isGroup;

  // participants_ids is the populated array from the API
  const participants = Array.isArray(activeChat?.participants_ids)
    ? activeChat.participants_ids
    : [];

  const currentParticipantIds = new Set(participants.map(p => (p?._id || p)?.toString()));

  // Employees not already in the group — available to add
  const availableToAdd = useMemo(() => {
    return allEmployees.filter(emp => {
      const uid = (emp.user_id || emp.user?._id || emp._id)?.toString();
      return uid && !currentParticipantIds.has(uid);
    });
  }, [allEmployees, currentParticipantIds]);

  const filteredToAdd = availableToAdd.filter(emp => {
    const name = emp.user?.name || "";
    return name.toLowerCase().includes(addSearch.toLowerCase());
  });

  const toggleSelectAdd = (uid) => {
    setSelectedToAdd(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleArchive = async () => {
    try {
      await archiveChat({ chatId: activeChat._id, is_archived: !activeChat.is_archived }).unwrap();
      onClose();
    } catch {
      setApiResponse({ isOpen: true, status: "error", message: t("Failed to archive chat") });
    }
  };

  const handleExport = () => {
    if (!isSubscriber) {
      setApiResponse({ isOpen: true, status: "error", message: t("You don't have permission to export chats.") });
      return;
    }
    const token = localStorage.getItem("token");
    window.open(`${RootRoute}/api/chats/${activeChat._id}/export?token=${token}`, "_blank");
  };

  const handleRemoveParticipant = async (userId) => {
    setRemovingId(userId);
    try {
      await removeParticipant({ chatId: activeChat._id, userId }).unwrap();
      setApiResponse({ isOpen: true, status: "success", message: t("Member removed successfully") });
    } catch {
      setApiResponse({ isOpen: true, status: "error", message: t("Failed to remove participant") });
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddParticipants = async () => {
    if (selectedToAdd.length === 0) return;
    try {
      await addParticipants({ chatId: activeChat._id, participantIds: selectedToAdd }).unwrap();
      setApiResponse({ isOpen: true, status: "success", message: t("Members added successfully") });
      setSelectedToAdd([]);
      setShowAddPanel(false);
      setAddSearch("");
    } catch {
      setApiResponse({ isOpen: true, status: "error", message: t("Failed to add participants") });
    }
  };

  const isAlertOpen = useIsAlertOpen();

  const avatarLetter = (name) => (name || "?").charAt(0).toUpperCase();

  return (
    <>
      {!isAlertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="p-4 border-b border-status-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-cell-primary">{t("Chat Details")}</h2>
              <button onClick={onClose} className="p-2 hover:bg-weak-100 rounded-full text-sub-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col items-center">

              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg mb-4 border-2 flex-shrink-0"
                style={{ backgroundColor: 'var(--color-blue-ebf1ff)', color: 'var(--color-primary)', borderColor: 'var(--status-border)' }}
              >
                {activeChat.image ? (
                  <img src={activeChat.image} alt={activeChat.title} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  avatarLetter(activeChat.title || participants.find(p => p._id !== currentUser?._id)?.name)
                )}
              </div>

              <h3 className="text-xl font-bold text-cell-primary mb-1">
                {activeChat.title || participants.find(p => p._id !== currentUser?._id)?.name || t("Direct Chat")}
              </h3>
              <p className="text-sm text-sub-500 mb-6">{isGroup ? t("Group Chat") : t("Direct Chat")}</p>

              {/* Actions */}
              <div className="w-full space-y-2">
                <h4 className="text-sm font-bold text-cell-secondary uppercase tracking-wider mb-3 px-1">{t("Actions")}</h4>

                <button
                  onClick={handleArchive}
                  disabled={isArchiving}
                  className="w-full flex items-center gap-3 p-3 bg-weak-50 hover:bg-weak-100 rounded-xl text-cell-primary font-medium transition-colors border border-status-border"
                >
                  <Archive size={18} className="text-sub-500" />
                  {activeChat.is_archived ? t("Unarchive Chat") : t("Archive Chat")}
                </button>

                {isSubscriber && (
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-3 p-3 bg-weak-50 hover:bg-weak-100 rounded-xl text-cell-primary font-medium transition-colors border border-status-border"
                  >
                    <Download size={18} className="text-sub-500" />
                    {t("Export Chat History")}
                  </button>
                )}

                {/* Participants section — groups only */}
                {isGroup && (
                  <div className="mt-6 pt-4 border-t border-status-border w-full">

                    {/* Section header */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-sub-500" />
                        <h4 className="text-sm font-bold text-cell-secondary uppercase tracking-wider">
                          {t("Members")} ({participants.length})
                        </h4>
                      </div>
                      {isSubscriber && (
                        <button
                          onClick={() => { setShowAddPanel(prev => !prev); setSelectedToAdd([]); setAddSearch(""); }}
                          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-600 transition-colors"
                        >
                          <UserPlus size={14} />
                          {t("Add")}
                          {showAddPanel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                    </div>

                    {/* Add members panel */}
                    {showAddPanel && isSubscriber && (
                      <div className="mb-4 p-3 bg-weak-50 rounded-xl border border-status-border space-y-3">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sub-400" />
                          <input
                            type="text"
                            value={addSearch}
                            onChange={e => setAddSearch(e.target.value)}
                            placeholder={t("Search employees...")}
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-status-border bg-surface outline-none focus:border-primary text-cell-primary"
                          />
                        </div>

                        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                          {filteredToAdd.length === 0 ? (
                            <p className="text-xs text-sub-400 text-center py-3">{t("No employees found")}</p>
                          ) : (
                            filteredToAdd.map(emp => {
                              const uid = (emp.user_id || emp.user?._id || emp._id)?.toString();
                              const name = emp.user?.name || t("Unknown");
                              const isSelected = selectedToAdd.includes(uid);
                              return (
                                <button
                                  key={uid}
                                  onClick={() => toggleSelectAdd(uid)}
                                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-weak-100 border border-transparent"}`}
                                >
                                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                    {avatarLetter(name)}
                                  </div>
                                  <span className="text-sm text-cell-primary flex-1">{name}</span>
                                  {isSelected && <Check size={14} className="text-primary flex-shrink-0" />}
                                </button>
                              );
                            })
                          )}
                        </div>

                        <button
                          onClick={handleAddParticipants}
                          disabled={selectedToAdd.length === 0 || isAdding}
                          className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                          {isAdding ? t("Adding...") : `${t("Add")} ${selectedToAdd.length > 0 ? `(${selectedToAdd.length})` : ""}`}
                        </button>
                      </div>
                    )}

                    {/* Members list */}
                    <div className="space-y-1">
                      {participants.length === 0 ? (
                        <p className="text-sm text-sub-400 text-center py-4">{t("No members found")}</p>
                      ) : (
                        participants.map((participant) => {
                          const pid = participant?._id?.toString();
                          const pname = participant?.name || participant?.user?.name || t("Unknown");
                          const isCurrentUser = pid === currentUser?._id?.toString();
                          const isRemoving = removingId === pid;
                          return (
                            <div
                              key={pid}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-weak-50 border border-transparent hover:border-status-border transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                                  {participant?.image ? (
                                    <img src={participant.image} alt={pname} className="w-full h-full rounded-full object-cover" />
                                  ) : avatarLetter(pname)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-cell-primary">
                                    {pname}
                                    {isCurrentUser && (
                                      <span className="ml-2 text-[10px] text-primary font-normal">({t("You")})</span>
                                    )}
                                  </p>
                                  {participant?.email && (
                                    <p className="text-[10px] text-sub-500">{participant.email}</p>
                                  )}
                                </div>
                              </div>

                              {isSubscriber && !isCurrentUser && (
                                <button
                                  onClick={() => handleRemoveParticipant(pid)}
                                  disabled={isRemoving}
                                  title={t("Remove member")}
                                  className="p-1.5 text-sub-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                >
                                  {isRemoving ? (
                                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                                  ) : (
                                    <UserMinus size={16} />
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
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
