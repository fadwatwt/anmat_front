"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RiBellLine } from "react-icons/ri";
import {
  useGetAppointmentsQuery,
  useGetDailyTasksQuery,
  useDeleteAppointmentMutation,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
  useUpdateAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import Page from "@/components/Page.jsx";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import ShareAppointment from "@/components/Appointments/ShareAppointment";
import EditAppointmentModal from "@/components/Appointments/EditAppointmentModal";
import EditReminderModal from "@/components/Agenda/EditReminderModal";
import ReminderCard from "@/components/Agenda/ReminderCard";
import Alert from "@/components/Alerts/Alert";
import MonthlyCalendar from "@/components/Agenda/MonthlyCalendar";
import DayDetailSidebar from "@/components/Agenda/DayDetailSidebar";
import AgendaHeader from "@/components/Agenda/AgendaHeader";
import DailyTaskCard from "@/components/Agenda/DailyTaskCard";
import CreateAgendaModal from "@/components/Agenda/CreateAgendaModal";
import TodayView from "@/components/Agenda/TodayView";
import YesterdayTasksNotice from "@/components/Agenda/YesterdayTasksNotice";

function AppointmentsPage() {
  const { t } = useTranslation();

  const [view, setView] = useState("today");
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({ status: "", category: "" });

  const [shareAppointment, setShareAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [isCompleteAlertOpen, setIsCompleteAlertOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [reminderToEdit, setReminderToEdit] = useState(null);
  const [isEditReminderModalOpen, setIsEditReminderModalOpen] = useState(false);
  const [reminderToComplete, setReminderToComplete] = useState(null);
  const [isCompleteReminderAlertOpen, setIsCompleteReminderAlertOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState(null);
  const [isDeleteReminderAlertOpen, setIsDeleteReminderAlertOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDate, setCreateModalDate] = useState(null);
  const [createModalTab, setCreateModalTab] = useState("appointment");

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useGetAppointmentsQuery(filters, { skip: view !== "list" });

  const {
    data: dailyTasks = [],
    isLoading: loadingTasks,
  } = useGetDailyTasksQuery(filters, { skip: view !== "list" });

  const [deleteAppointment] = useDeleteAppointmentMutation();
  const [completeAppointment] = useCompleteAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();

  const handleDelete = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete._id).unwrap();
        setIsDeleteAlertOpen(false);
        setAppointmentToDelete(null);
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  const requestDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteAlertOpen(true);
  };

  const requestEdit = (appointment) => {
    if (appointment.category === "reminder") {
      setReminderToEdit(appointment);
      setIsEditReminderModalOpen(true);
      return;
    }
    setAppointmentToEdit(appointment);
    setIsEditModalOpen(true);
  };

  const handleEditReminderSave = async ({ _id, title, date, start_time, reminder_types, notes }) => {
    try {
      await updateAppointment({ id: _id, title, date, start_time, reminder_types, notes }).unwrap();
      setIsEditReminderModalOpen(false);
      setReminderToEdit(null);
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const requestCompleteReminder = (id) => {
    const reminder = appointments.find((a) => a._id === id);
    setReminderToComplete(reminder);
    setIsCompleteReminderAlertOpen(true);
  };

  const handleCompleteReminder = async () => {
    if (reminderToComplete) {
      try {
        await completeAppointment(reminderToComplete._id).unwrap();
        setIsCompleteReminderAlertOpen(false);
        setReminderToComplete(null);
      } catch (error) {
        console.error("Failed to complete reminder:", error);
      }
    }
  };

  const requestDeleteReminder = (id) => {
    const reminder = appointments.find((a) => a._id === id);
    setReminderToDelete(reminder);
    setIsDeleteReminderAlertOpen(true);
  };

  const handleDeleteReminder = async () => {
    if (reminderToDelete) {
      try {
        await deleteAppointment(reminderToDelete._id).unwrap();
        setIsDeleteReminderAlertOpen(false);
        setReminderToDelete(null);
      } catch (error) {
        console.error("Failed to delete reminder:", error);
      }
    }
  };

  const handleEditSave = async (data) => {
    if (appointmentToEdit) {
      try {
        await updateAppointment({ id: appointmentToEdit._id, ...data }).unwrap();
        setIsEditModalOpen(false);
        setAppointmentToEdit(null);
      } catch (error) {
        console.error("Failed to update appointment:", error);
      }
    }
  };

  const requestComplete = (id) => {
    const appt = appointments.find((a) => a._id === id);
    setAppointmentToComplete(appt);
    setIsCompleteAlertOpen(true);
  };

  const requestCancel = (id) => {
    const appt = appointments.find((a) => a._id === id);
    setAppointmentToCancel(appt);
    setIsCancelAlertOpen(true);
  };

  const handleComplete = async () => {
    if (appointmentToComplete) {
      try {
        await completeAppointment(appointmentToComplete._id).unwrap();
        setIsCompleteAlertOpen(false);
        setAppointmentToComplete(null);
      } catch (error) {
        console.error("Failed to complete appointment:", error);
      }
    }
  };

  const handleCancel = async () => {
    if (appointmentToCancel) {
      try {
        await cancelAppointment(appointmentToCancel._id).unwrap();
        setIsCancelAlertOpen(false);
        setAppointmentToCancel(null);
      } catch (error) {
        console.error("Failed to cancel appointment:", error);
      }
    }
  };

  const openCreateModal = (tab = "appointment", date = null) => {
    setCreateModalTab(tab);
    setCreateModalDate(date);
    setIsCreateModalOpen(true);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming" && a.category !== "reminder");
  const completedAppointments = appointments.filter((a) => a.status === "completed" && a.category !== "reminder");
  const upcomingReminders = appointments.filter((a) => a.status === "upcoming" && a.category === "reminder");
  const completedReminders = appointments.filter((a) => a.status === "completed" && a.category === "reminder");
  const pendingTasks = dailyTasks.filter((t) => t.status !== "completed");
  const completedTasks = dailyTasks.filter((t) => t.status === "completed");

  if (error) {
    return (
      <Page title={t("Agenda")}>
        <div className="text-center text-red-500 mt-8">
          {t("Failed to load agenda. Please try again later.")}
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page title={t("Agenda")} isBtn={false}>
        <div className="space-y-4">
          <AgendaHeader
            view={view}
            setView={setView}
            onAdd={() => openCreateModal("appointment")}
          />

          {/* Yesterday's incomplete tasks notice — only show on today tab */}
          {view === "today" && <YesterdayTasksNotice />}

          {/* Today view */}
          {view === "today" && (
            <TodayView onOpenCreateModal={openCreateModal} />
          )}

          {/* Calendar view */}
          {view === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MonthlyCalendar
                  onDaySelect={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>
              <div>
                <DayDetailSidebar
                  selectedDate={selectedDate}
                  onAddAppointment={(date) => openCreateModal("appointment", date)}
                  onAddTask={(date) => openCreateModal("task", date)}
                />
              </div>
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t("Appointments")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">{t("All Status")}</option>
                        <option value="upcoming">{t("Upcoming")}</option>
                        <option value="completed">{t("Completed")}</option>
                        <option value="cancelled">{t("Cancelled")}</option>
                      </select>

                      <select
                        value={filters.category}
                        onChange={(e) =>
                          setFilters({ ...filters, category: e.target.value })
                        }
                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">{t("All Categories")}</option>
                        <option value="meeting">🤝 {t("Meeting")}</option>
                        <option value="task">📋 {t("Task")}</option>
                        <option value="project">📁 {t("Project")}</option>
                        <option value="interview">🎤 {t("Interview")}</option>
                        <option value="training">📚 {t("Training")}</option>
                        <option value="deadline">⏰ {t("Deadline")}</option>
                        <option value="other">📌 {t("Other")}</option>
                      </select>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-6">{t("Loading...")}</div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      {t("No appointments found")}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {t("Upcoming")} ({upcomingAppointments.length})
                          </h4>
                          <div className="space-y-2">
                            {upcomingAppointments.map((appointment) => (
                              <AppointmentCard
                                key={appointment._id}
                                appointment={appointment}
                                size="md"
                                showCountdown={true}
                                onComplete={requestComplete}
                                onCancel={requestCancel}
                                onEdit={requestEdit}
                                onDelete={requestDelete}
                                onShare={setShareAppointment}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {completedAppointments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {t("Completed")} ({completedAppointments.length})
                          </h4>
                          <div className="space-y-2">
                            {completedAppointments.map((appointment) => (
                              <AppointmentCard
                                key={appointment._id}
                                appointment={appointment}
                                size="sm"
                                showCountdown={false}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reminders section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-900/40 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <RiBellLine size={16} className="text-amber-500" />
                      {t("Reminders")}
                    </h3>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-6">{t("Loading...")}</div>
                  ) : upcomingReminders.length === 0 && completedReminders.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      {t("No reminders found")}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingReminders.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {t("Upcoming")} ({upcomingReminders.length})
                          </h4>
                          <div className="space-y-2">
                            {upcomingReminders.map((reminder) => (
                              <ReminderCard
                                key={reminder._id}
                                reminder={reminder}
                                onComplete={requestCompleteReminder}
                                onDelete={requestDeleteReminder}
                                onEdit={requestEdit}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {completedReminders.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {t("Completed")} ({completedReminders.length})
                          </h4>
                          <div className="space-y-2">
                            {completedReminders.map((reminder) => (
                              <ReminderCard
                                key={reminder._id}
                                reminder={reminder}
                                onComplete={requestCompleteReminder}
                                onDelete={requestDeleteReminder}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {t("Daily Tasks")}
                  </h3>
                  {loadingTasks ? (
                    <div className="text-center py-6">{t("Loading...")}</div>
                  ) : dailyTasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      {t("No daily tasks")}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pendingTasks.map((task) => (
                        <DailyTaskCard key={task._id} task={task} size="sm" />
                      ))}
                      {completedTasks.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {t("Completed")} ({completedTasks.length})
                          </h4>
                          {completedTasks.map((task) => (
                            <DailyTaskCard key={task._id} task={task} size="sm" />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Page>

      <CreateAgendaModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateModalDate(null);
        }}
        initialDate={createModalDate}
        initialTab={createModalTab}
      />

      <ShareAppointment
        appointment={shareAppointment}
        isOpen={!!shareAppointment}
        onClose={() => setShareAppointment(null)}
      />

      <EditAppointmentModal
        appointment={appointmentToEdit}
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setAppointmentToEdit(null); }}
        onSave={handleEditSave}
      />

      <EditReminderModal
        isOpen={isEditReminderModalOpen}
        reminder={reminderToEdit}
        onClose={() => { setIsEditReminderModalOpen(false); setReminderToEdit(null); }}
        onSave={handleEditReminderSave}
      />

      <Alert
        type="success"
        title={t("Complete Reminder?")}
        message={t("Are you sure you want to mark this reminder as completed?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Complete")}
        isOpen={isCompleteReminderAlertOpen}
        onClose={() => { setIsCompleteReminderAlertOpen(false); setReminderToComplete(null); }}
        onSubmit={handleCompleteReminder}
        isBtns={1}
      />

      <Alert
        type="delete"
        title={t("Delete Reminder?")}
        message={t("Are you sure you want to delete this reminder?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isDeleteReminderAlertOpen}
        onClose={() => { setIsDeleteReminderAlertOpen(false); setReminderToDelete(null); }}
        onSubmit={handleDeleteReminder}
        isBtns={1}
      />

      <Alert
        type="success"
        title={t("Complete Appointment?")}
        message={t("Are you sure you want to mark this appointment as completed?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Complete")}
        isOpen={isCompleteAlertOpen}
        onClose={() => { setIsCompleteAlertOpen(false); setAppointmentToComplete(null); }}
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
        onClose={() => { setIsCancelAlertOpen(false); setAppointmentToCancel(null); }}
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
        onClose={() => { setIsDeleteAlertOpen(false); setAppointmentToDelete(null); }}
        onSubmit={handleDelete}
        isBtns={1}
      />
    </>
  );
}

export default AppointmentsPage;
