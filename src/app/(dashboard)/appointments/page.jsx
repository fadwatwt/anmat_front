"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useGetAppointmentsQuery,
  useGetDailyTasksQuery,
  useDeleteAppointmentMutation,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import Page from "@/components/Page.jsx";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import ShareAppointment from "@/components/Appointments/ShareAppointment";
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

  const handleComplete = async (id) => {
    try {
      await completeAppointment(id).unwrap();
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const openCreateModal = (tab = "appointment", date = null) => {
    setCreateModalTab(tab);
    setCreateModalDate(date);
    setIsCreateModalOpen(true);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const completedAppointments = appointments.filter((a) => a.status === "completed");
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
                                onComplete={handleComplete}
                                onCancel={handleCancel}
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

      <Alert
        type="warning"
        title={t("Delete Appointment?")}
        message={t("Are you sure you want to delete this appointment?")}
        titleCancelBtn={t("Cancel")}
        titleSubmitBtn={t("Delete")}
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={handleDelete}
        isBtns={1}
      />
    </>
  );
}

export default AppointmentsPage;
