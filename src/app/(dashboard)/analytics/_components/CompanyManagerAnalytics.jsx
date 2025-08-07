"use client";
import React from 'react'
import PropTypes from "prop-types";
import Page from "@/components/Page.jsx";
import TasksSummaryChart from '@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart';
import TasksRatingChart from '@/app/(dashboard)/analytics/_components/employee/TasksRatingChart';
import TasksTimelineChart from '@/app/(dashboard)/analytics/_components/employee/TasksTimelineChart';
import TasksPerformanceChart from '@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart';
import ProjectsPerformanceChart from '@/app/(dashboard)/analytics/_components/employee/ProjectsPerformanceChart';
import ProjectTimelineChart from '@/app/(dashboard)/analytics/_components/employee/ProjectTimelineChart';
import ProjectsPerformanceList from '@/app/(dashboard)/analytics/_components/employee/ProjectsPerformanceList';
import LastProjectsList from '@/app/(dashboard)/analytics/_components/employee/LastProjectsList';
import EmployeeAttendanceChart from '@/app/(dashboard)/analytics/_components/company_manager/employees/EmployeeAttendanceChart';
import EmployeePerformanceChart from '@/app/(dashboard)/analytics/_components/company_manager/employees/EmployeePerformanceChart';
import EmployeeAdherenceChart from '@/app/(dashboard)/analytics/_components/company_manager/employees/EmployeeAdherenceChart';
import EmployeeAccomplishmentChart from '@/app/(dashboard)/analytics/_components/company_manager/employees/EmployeeAccomplishmentChart';
import TopEmployeesList from '@/app/(dashboard)/analytics/_components/company_manager/employees/TopEmployeesList';
import EmployeeTasksDelayChart from '@/app/(dashboard)/analytics/_components/company_manager/employees/EmployeeTasksDelayChart';
import DepartmentAdherenceChart from '@/app/(dashboard)/analytics/_components/company_manager/departments/DepartmentAdherenceChart';
import DepartmentPerformanceChart from '@/app/(dashboard)/analytics/_components/company_manager/departments/DepartmentPerformanceChart';
import DepartmentsRankingTable from '@/app/(dashboard)/analytics/_components/company_manager/departments/DepartmentsRankingTable';

function CompanyManagerAnalytics() {

    return (
        <Page isTitle={true} title={"All Analytics Overview"}>
            <div className="flex flex-col gap-12">
                {/* Tasks Analytics */}
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        Tasks Analytics
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <TasksSummaryChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TasksPerformanceChart />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <TasksTimelineChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TasksRatingChart />
                        </div>
                    </div>
                </div>

                {/* Projects Analytics */}
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        Projects Analytics
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <ProjectsPerformanceChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <ProjectTimelineChart />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-2/3">
                            <ProjectsPerformanceList />
                        </div>
                        <div className="w-full md:w-1/3">
                            <LastProjectsList />
                        </div>
                    </div>
                </div>

                {/* Employees Analytics */}
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        Employees Analytics
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <EmployeeAttendanceChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <EmployeePerformanceChart />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <EmployeeAccomplishmentChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <EmployeeAdherenceChart />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <EmployeeTasksDelayChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <TopEmployeesList />
                        </div>
                    </div>
                </div>

                {/* Departments Analytics */}
                <div className="flex flex-col items-start justify-start gap-4">
                    <span className="text-lg text-gray-500">
                        Departments Analytics
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-1/2">
                            <DepartmentAdherenceChart />
                        </div>
                        <div className="w-full md:w-1/2">
                            <DepartmentPerformanceChart />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-stretch gap-4 justify-between w-full">
                        <div className="w-full md:w-full">
                            <DepartmentsRankingTable />
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
}

CompanyManagerAnalytics.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
};
export default CompanyManagerAnalytics;