"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  useGetAppointmentsQuery,
  useDeleteAppointmentMutation,
  useCompleteAppointmentMutation,
  useCancelAppointmentMutation,
} from "@/redux/appointments/appointmentsApi";
import Page from "@/components/Page.jsx";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import TodayAppointments from "@/components/Appointments/TodayAppointments";
import CountdownWidget from "@/components/Appointments/CountdownWidget";
import ShareAppointment from "@/components/Appointments/ShareAppointment";
import Alert from "@/components/Alerts/Alert";
import useAuthStore from "@/store/authStore";
import { RiAddLine, RiFilterLine } from "react-icons/ri";

function AppointmentsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { authUserType } = useAuthStore();

  const [filters, setFilters] = useState({
    status: "",
    category: "",
  });

  const [shareAppointment, setShareAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useGetAppointmentsQuery(filters);

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

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "upcoming"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  if (error) {
    return (
      <Page title={t("Appointments")}>
        <div className="text-center text-red-500 mt-8">
          {t("Failed to load appointments. Please try again later.")}
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page
        title={t("Appointments")}
        isBtn={true}
        btnOnClick={() => router.push("/appointments/create")}
        btnTitle={t("Create Appointment")}
      >
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TodayAppointments maxItems={5} />
            </div>
            <div>
              <CountdownWidget maxItems={3} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t("All Appointments")}
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
      </Page>

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
