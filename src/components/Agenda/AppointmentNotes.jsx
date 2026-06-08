"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAddAppointmentNotesMutation,
  useAddEmployeeAppointmentNotesMutation,
} from "@/redux/appointments/appointmentsApi";
import { RiStickyNoteLine, RiCheckLine, RiCloseLine, RiEditLine } from "react-icons/ri";

const QUICK_NOTES = [
  { key: "meeting_done", label: "تم الاجتماع", color: "text-green-600" },
  { key: "agreed_on", label: "تم الاتفاق على", color: "text-blue-600" },
  { key: "awaiting_response", label: "بانتظار الرد", color: "text-orange-600" },
  { key: "postponed", label: "تم التأجيل", color: "text-purple-600" },
  { key: "cancelled", label: "تم الإلغاء", color: "text-red-600" },
];

function AppointmentNotes({ appointmentId, notes, isEmployee = false, onUpdate }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(notes || "");

  const [addNotes] = isEmployee
    ? useAddEmployeeAppointmentNotesMutation()
    : useAddAppointmentNotesMutation();

  const handleSave = async () => {
    try {
      await addNotes({ id: appointmentId, notes: noteText }).unwrap();
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  const handleQuickNote = async (quickNote) => {
    const newNote = noteText
      ? `${noteText}\n${quickNote.label}: `
      : `${quickNote.label}: `;
    setNoteText(newNote);
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiStickyNoteLine size={18} className="text-primary-500" />
          <h4 className="font-medium text-gray-900 dark:text-white">{t("Notes")}</h4>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
          >
            <RiEditLine size={14} />
            {notes ? t("Edit") : t("Add Note")}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder={t("Add your notes here...")}
            autoFocus
          />

          <div className="flex flex-wrap gap-2">
            {QUICK_NOTES.map((qn) => (
              <button
                key={qn.key}
                onClick={() => handleQuickNote(qn)}
                className={`text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${qn.color}`}
              >
                {qn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              <RiCheckLine size={14} />
              {t("Save")}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNoteText(notes || "");
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RiCloseLine size={14} />
              {t("Cancel")}
            </button>
          </div>
        </div>
      ) : notes ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            {notes}
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_NOTES.map((qn) => (
              <button
                key={qn.key}
                onClick={() => handleQuickNote(qn)}
                className={`text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${qn.color}`}
              >
                + {qn.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("No notes yet")}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {QUICK_NOTES.map((qn) => (
              <button
                key={qn.key}
                onClick={() => handleQuickNote(qn)}
                className={`text-xs px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${qn.color}`}
              >
                {qn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentNotes;
