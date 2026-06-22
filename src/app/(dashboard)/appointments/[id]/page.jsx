"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  useGetAppointmentDetailsQuery,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
  useDeleteAppointmentMutation,
  useUpdateAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import Page from "@/components/Page.jsx";
import AppointmentNotes from "@/components/Agenda/AppointmentNotes";
import ShareAppointment from "@/components/Appointments/ShareAppointment";
import EditAppointmentModal from "@/components/Appointments/EditAppointmentModal";
import Alert from "@/components/Alerts/Alert";
import {
  RiArrowLeftLine,
  RiCalendarLine,
  RiTimeLine,
  RiMapPinLine,
  RiUserLine,
  RiCheckLine,
  RiCloseLine,
  RiShareLine,
  RiDeleteBinLine,
  RiEditLine,
  RiTaskLine,
  RiStickyNoteLine,
} from "react-icons/ri";
import AppointmentCategoryBadge from "@/components/Appointments/AppointmentCategoryBadge";

function AppointmentDetailPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id;

  const [shareAppointment, setShareAppointment] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isCompleteAlertOpen, setIsCompleteAlertOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: appointment, isLoading, error } = useGetAppointmentDetailsQuery(appointmentId);
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd MMMM, yyyy", { locale: ar });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? t("PM") : t("AM");
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleComplete = async () => {
    try {
      await completeAppointment(appointmentId).unwrap();
      setIsCompleteAlertOpen(false);
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointmentId).unwrap();
      setIsCancelAlertOpen(false);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentId).unwrap();
      setIsDeleteAlertOpen(false);
      router.push("/appointments");
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const handleEditSave = async (data) => {
    try {
      await updateAppointment({ id: appointmentId, ...data }).unwrap();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  if (isLoading) {
    return (
      <Page title={t("Appointment Details")}>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !appointment) {
    return (
      <Page title={t("Appointment Details")}>
        <div className="text-center text-red-500 mt-8">
          {t("Failed to load appointment details.")}
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page title={t("Appointment Details")}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <RiArrowLeftLine size={20} />
            {t("Back")}
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
              className="h-2"
              style={{ backgroundColor: appointment.color || "#3B82F6" }}
            />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <AppointmentCategoryBadge
                      category={appointment.category}
                      color={appointment.color}
                      size="md"
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : appointment.status === "cancelled"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {appointment.status === "completed"
                        ? t("Completed")
                        : appointment.status === "cancelled"
                        ? t("Cancelled")
                        : t("Upcoming")}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {appointment.title}
                  </h1>

                  {appointment.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {appointment.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title={t("Edit")}
                  >
                    <RiEditLine size={20} />
                  </button>
                  <button
                    onClick={() => setShareAppointment(appointment)}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title={t("Share")}
                  >
                    <RiShareLine size={20} />
                  </button>
                  <button
                    onClick={() => setIsDeleteAlertOpen(true)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title={t("Delete")}
                  >
                    <RiDeleteBinLine size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <RiCalendarLine size={20} className="text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("Date")}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(appointment.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <RiTimeLine size={20} className="text-primary-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("Time")}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatTime(appointment.start_time)}
                      {appointment.end_time && ` - ${formatTime(appointment.end_time)}`}
                    </p>
                  </div>
                </div>

                {appointment.location && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <RiMapPinLine size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Location")}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.location}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.user && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <RiUserLine size={20} className="text-primary-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Created by")}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {appointment.user.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {appointment.attendee_list?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t("Attendees")} ({appointment.attendee_list.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {appointment.attendee_list.map((attendee) => (
                      <span
                        key={attendee._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                      >
                        {attendee.imageProfile ? (
                          <img
                            src={attendee.imageProfile}
                            alt={attendee.name}
                            className="w-5 h-5 rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs text-primary-600 dark:text-primary-400">
                            {attendee.name?.charAt(0)}
                          </div>
                        )}
                        {attendee.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {appointment.task && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RiTaskLine size={16} className="text-blue-500" />
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {t("Linked Task")}
                    </h3>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {appointment.task.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("Status")}: {appointment.task.status} • {t("Priority")}: {appointment.task.priority}
                  </p>
                </div>
              )}

              <AppointmentNotes
                appointmentId={appointmentId}
                notes={appointment.notes}
              />

              {appointment.status === "upcoming" && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsCompleteAlertOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                  >
                    <RiCheckLine size={16} />
                    {t("Mark as Completed")}
                  </button>
                  <button
                    onClick={() => setIsCancelAlertOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
                  >
                    <RiCloseLine size={16} />
                    {t("Cancel Appointment")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Page>

      <ShareAppointment
        appointment={shareAppointment}
        isOpen={!!shareAppointment}
        onClose={() => setShareAppointment(null)}
      />

      <Alert
        type="success"
        title={t("Complete Appointment?")}
        message={t("Are you sure you want to mark this appointment as completed?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Complete")}
        isOpen={isCompleteAlertOpen}
        onClose={() => setIsCompleteAlertOpen(false)}
        onSubmit={handleComplete}
        isBtns={1}
      />

      <Alert
        type="warning"
        title={t("Cancel Appointment?")}
        message={t("Are you sure you want to cancel this appointment?")}
        titleCancelBtn={t("No")}
        titleSubmitBtn={t("Yes, Cancel")}
        isOpen={isCancelAlertOpen}
        onClose={() => setIsCancelAlertOpen(false)}
        onSubmit={handleCancel}
        isBtns={1}
      />

      <Alert
        type="delete"
        title={t("Delete Appointment?")}
        message={t("Are you sure you want to delete this appointment?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={handleDelete}
        isBtns={1}
      />

      <EditAppointmentModal
        appointment={appointment}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </>
  );
}

export default AppointmentDetailPage;
