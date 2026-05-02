"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RiSearchLine, RiCheckLine } from "@remixicon/react";
import Modal from "@/components/Modal/Modal";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useSendAdminNotificationMutation } from "@/redux/api/notificationsApi";
import { useGetAdminsQuery } from "@/redux/system-admins/systemAdminsAPI";
import { useGetSubscribersQuery } from "@/redux/subscribers/subscribersApi";
import { useProcessing } from "@/app/providers";

const TARGET_OPTIONS = [
  { value: "specific_users", label: "Specific Users" },
  { value: "all_subscribers", label: "All Subscribers" },
  { value: "all_admins", label: "All Admins" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Normal (default)" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

const INITIAL_FORM = {
  target: "specific_users",
  title: "",
  message: "",
  priority: "",
  action_url: "",
  user_ids: [],
};

const inputClass =
  "w-full bg-main border border-status-border rounded-lg px-3 py-2 text-sm text-cell-primary placeholder:text-sub-500 outline-none focus:ring-2 focus:ring-primary-500/30 transition";

const labelClass = "text-sm font-medium text-cell-primary";

/**
 * @param {object}  preSelectedUser  – { _id, name } of the row that triggered the modal
 * @param {"admin"|"subscriber"} sourceType – controls which user list is shown for specific_users
 */
const SendAdminNotificationModal = ({ isOpen, onClose, preSelectedUser, sourceType }) => {
  const { t } = useTranslation();
  const { showProcessing, hideProcessing } = useProcessing();
  const [form, setForm] = useState(INITIAL_FORM);
  const [userSearch, setUserSearch] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const [sendNotification] = useSendAdminNotificationMutation();

  const isAdminSource = sourceType === "admin";

  const { data: adminsResponse } = useGetAdminsQuery(undefined, {
    skip: !isOpen || !isAdminSource,
  });
  const { data: subscribersData } = useGetSubscribersQuery(undefined, {
    skip: !isOpen || isAdminSource,
  });

  const userPool = isAdminSource
    ? adminsResponse?.data || []
    : subscribersData || [];

  const filteredUsers = userPool.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  // Reset form every time the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        ...INITIAL_FORM,
        user_ids: preSelectedUser?._id ? [preSelectedUser._id] : [],
      });
      setUserSearch("");
    }
  }, [isOpen, preSelectedUser]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleUser = (id) =>
    set(
      "user_ids",
      form.user_ids.includes(id)
        ? form.user_ids.filter((x) => x !== id)
        : [...form.user_ids, id]
    );

  const handleTargetChange = (value) => {
    setForm((prev) => ({
      ...prev,
      target: value,
      // Reset selection to just the pre-selected user when switching back to specific_users
      user_ids: value === "specific_users" && preSelectedUser?._id
        ? [preSelectedUser._id]
        : [],
    }));
  };

  const confirmMessage = {
    specific_users: `${t("Send this notification to")} ${form.user_ids.length} ${t("selected user(s)")}?`,
    all_admins: t("Send this notification to all admins?"),
    all_subscribers: t("Send this notification to all subscribers?"),
  }[form.target];

  // Step 1: clicking Send opens the confirmation dialog
  const handleSubmit = () => setIsConfirmOpen(true);

  // Step 2: user confirmed — run the API call
  const handleConfirmedSend = async () => {
    setIsConfirmOpen(false);
    onClose();

    const body = {
      target: form.target,
      title: form.title.trim(),
      message: form.message.trim(),
    };
    if (form.priority) body.priority = form.priority;
    if (form.action_url.trim()) body.action_url = form.action_url.trim();
    if (form.target === "specific_users") body.user_ids = form.user_ids;

    showProcessing(t("Sending notification..."));
    try {
      const result = await sendNotification(body).unwrap();
      const sent = result?.data?.sent ?? 0;
      setApiResponse({
        isOpen: true,
        status: "success",
        message: `${t("Notification sent successfully to")} ${sent} ${t("user(s).")}`,
      });
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || t("Failed to send notification"),
      });
    } finally {
      hideProcessing();
    }
  };

  const isValid =
    form.title.trim() &&
    form.message.trim() &&
    (form.target !== "specific_users" || form.user_ids.length > 0);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("Send Notification")}
        isBtns={true}
        btnApplyTitle={t("Send")}
        onClick={handleSubmit}
        disabled={!isValid}
      >
        <div className="flex flex-col gap-4 pt-1">

          {/* Row: Target + Priority */}
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className={labelClass}>
                {t("Send To")} <span className="text-red-500">*</span>
              </label>
              <select
                value={form.target}
                onChange={(e) => handleTargetChange(e.target.value)}
                className={inputClass}
              >
                {TARGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1.5">
              <label className={labelClass}>{t("Priority")}</label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className={inputClass}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              {t("Title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder={t("Notification title")}
              className={inputClass}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              {t("Message")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder={t("Notification message body")}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Action URL */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              {t("Action URL")}{" "}
              <span className="text-xs font-normal text-sub-500">({t("optional")})</span>
            </label>
            <input
              type="url"
              value={form.action_url}
              onChange={(e) => set("action_url", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {/* User multi-select — only for specific_users */}
          {form.target === "specific_users" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                {t("Select Recipients")}{" "}
                <span className="text-red-500">*</span>{" "}
                <span className="text-xs font-normal text-sub-500">
                  ({form.user_ids.length} {t("selected")})
                </span>
              </label>

              {/* Search input */}
              <div className="relative">
                <RiSearchLine
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sub-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder={t("Search by name or email...")}
                  className={`${inputClass} pl-9`}
                />
              </div>

              {/* Scrollable user list */}
              <div className="border border-status-border rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="p-4 text-sm text-sub-500 text-center">{t("No users found")}</p>
                ) : (
                  filteredUsers.map((user) => {
                    const selected = form.user_ids.includes(user._id);
                    return (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => toggleUser(user._id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 border-b border-status-border last:border-0 transition-colors text-left ${
                          selected
                            ? "bg-primary-100 dark:bg-primary-500/10"
                            : "hover:bg-status-bg"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-tr from-primary-500 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-cell-primary truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-sub-500 truncate">{user.email}</p>
                        </div>
                        {selected && (
                          <RiCheckLine size={16} className="text-primary-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ApprovalAlert
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmedSend}
        title={t("Send Notification")}
        message={confirmMessage}
        confirmBtnText={t("Send")}
        type="warning"
      />

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default SendAdminNotificationModal;
