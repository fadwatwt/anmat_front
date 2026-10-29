"use client";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import EmployeesTap from "@/app/(dashboard)/hr/employees/tabs/Employees.tap.jsx";
import { useState } from "react";
import RotationTap from "@/app/(dashboard)/hr/_Tabs/RotationTap.jsx";
import AttendanceTab from "@/app/(dashboard)/hr/employees/tabs/AttendanceTab.jsx";
import SalaryTab from "@/app/(dashboard)/hr/employees/tabs/SalaryTab.jsx";
import RequestsTab from "@/app/(dashboard)/hr/employees/tabs/RequestsTab.jsx";
import LeavesTab from "@/app/(dashboard)/hr/employees/tabs/LeavesTab.jsx";
import CreateADepartmentModal from "@/app/(dashboard)/hr/_modals/CreateADepartmentModal.jsx";
import InviteEmployeeModal from "@/app/(dashboard)/hr/_modals/InviteEmployeeModal";
import LifecyclePanel from "./LifecyclePanel";
import PerformancePanel from "./PerformancePanel";
import DevelopmentPanel from "./DevelopmentPanel";
import PayrollRunsPanel from "./PayrollRunsPanel";
import ContractsPanel from "./ContractsPanel";
import RecruitmentPanel from "./RecruitmentPanel";
import OrgStructurePanel from "./OrgStructurePanel";
import LearningPanel from "./LearningPanel";
import SurveysPanel from "./SurveysPanel";
import HROverview from "./HROverview";
import { usePermission } from "@/Hooks/usePermission";
import { useSelector } from "react-redux";
import { selectUserType } from "@/redux/auth/authSlice";
import { useTranslation } from "react-i18next";

function HRPage() {
    const { t } = useTranslation();
    const [isInviteEmployeeModal, setIsInviteEmployeeModal] = useState(false);
    const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const authUserType = useSelector(selectUserType);
    const isEmployee = authUserType === "Employee";

    const canViewEmployees = usePermission("employee_details.list");
    const canTrackAllAttendances = usePermission("attendances.track_all");
    const canTrackDeptAttendances = usePermission("attendances.track_department");
    const canViewAttendances = canTrackAllAttendances || canTrackDeptAttendances;
    const canTrackAllLeaves = usePermission("leaves.track_all");
    const canTrackDeptLeaves = usePermission("leaves.track_department");
    const canViewLeaves = canTrackAllLeaves || canTrackDeptLeaves;
    const canTrackAllRequests = usePermission("employee_requests.track_all");
    const canTrackDeptRequests = usePermission("employee_requests.track_department");
    const canViewRequests = canTrackAllRequests || canTrackDeptRequests;
    const canTrackAllSalary = usePermission("salary_transactions.track_all");
    const canTrackDeptSalary = usePermission("salary_transactions.track_department");
    const canViewSalary = canTrackAllSalary || canTrackDeptSalary;
    const canViewLifecycle = usePermission("employee_lifecycle.list");
    const canViewPerformance = usePermission("performance.list");
    const canViewDevelopment = usePermission("employee_development.list");
    const canViewContracts = usePermission("employee_contracts.list");
    const canViewRecruitment = usePermission("recruitment.list");
    const canViewOwnLearning = usePermission("learning.view");
    const canListLearning = usePermission("learning.list");
    const canViewLearning = canViewOwnLearning || canListLearning;
    const canViewOwnSurveys = usePermission("surveys.view");
    const canListSurveys = usePermission("surveys.list");
    const canViewSurveys = canViewOwnSurveys || canListSurveys;

    const sections = [
        ...(canViewEmployees ? [{
            key: "employees",
            title: t("Employees"),
            content: <EmployeesTap />,
        }] : []),
        ...(!isEmployee && canViewAttendances ? [{
            key: "attendance",
            title: t("Attendances"),
            content: <AttendanceTab />,
        }] : []),
        ...(!isEmployee && canViewLeaves ? [{
            key: "leaves",
            title: t("Short Leaves"),
            content: <LeavesTab />,
        }] : []),
        ...(!isEmployee && canViewRequests ? [{
            key: "requests",
            title: t("Requests"),
            content: <RequestsTab />,
        }] : []),
        ...(!isEmployee && canViewSalary ? [{
            key: "salary",
            title: t("Salary"),
            content: <SalaryTab />,
        }] : []),
        ...(canTrackAllSalary ? [{
            key: "payroll",
            title: t("Payroll runs"),
            content: <PayrollRunsPanel />,
        }] : []),
        ...(canViewLifecycle ? [{
            key: "lifecycle",
            title: t("Onboarding and offboarding"),
            content: <LifecyclePanel />,
        }] : []),
        ...(canViewPerformance ? [{
            key: "performance",
            title: t("Performance reviews"),
            content: <PerformancePanel />,
        }] : []),
        ...(canViewDevelopment ? [{
            key: "development",
            title: t("Development plans"),
            content: <DevelopmentPanel />,
        }] : []),
        ...(canViewContracts || isEmployee ? [{
            key: "contracts",
            title: t("Employee contracts"),
            content: <ContractsPanel />,
        }] : []),
        ...(canViewRecruitment ? [{
            key: "recruitment",
            title: t("Recruitment"),
            content: <RecruitmentPanel />,
        }] : []),
        ...(canViewEmployees ? [{ key: "organization", title: t("Organization chart"), content: <OrgStructurePanel /> }] : []),
        ...(canViewLearning ? [{ key: "learning", title: t("Learning and skills"), content: <LearningPanel /> }] : []),
        ...(canViewSurveys ? [{ key: "surveys", title: t("Surveys"), content: <SurveysPanel /> }] : []),
        // Rotations and Notifications removed from HR — available as dedicated pages/tabs:
        // Rotations is accessible via attendance management, Notifications via /notifications
        ...(canViewAttendances ? [{
            key: "rotations",
            title: t("Rotations"),
            content: <RotationTap />,
        }] : []),
    ];

    const tabsData = [
        {
            key: "overview",
            title: t("Overview"),
            content: <HROverview sections={sections} onNavigate={setActiveTab}
                canViewEmployees={canViewEmployees} canViewRequests={!isEmployee && canViewRequests} />,
        },
        ...sections,
    ];
    const activeTabIndex = Math.max(0, tabsData.findIndex((tab) => tab.key === activeTab));

    const handleInviteEmployeeModal = () => {
        setIsInviteEmployeeModal(!isInviteEmployeeModal);
    };

    const handelAddDepartmentModal = () => {
        setIsAddDepartmentModal(!isAddDepartmentModal);
    };

    return (
        <>
            <Page
                title={t("HR - Employees Management")}
            >
                <Tabs tabs={tabsData} activeTab={activeTabIndex}
                    onTabChange={(index) => setActiveTab(tabsData[index]?.key || "overview")} />
            </Page>

            <InviteEmployeeModal
                isOpen={isInviteEmployeeModal}
                onClose={handleInviteEmployeeModal} />

            <CreateADepartmentModal
                isOpen={isAddDepartmentModal}
                onClose={handelAddDepartmentModal}
            />
        </>
    );
}

export default HRPage;
