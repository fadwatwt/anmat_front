"use client";
import { useParams } from 'next/navigation';
import Table from "@/components/Tables/Table.jsx";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import {
    RiTeamLine, RiCheckDoubleLine, RiLineChartLine,
    RiBuilding2Line, RiStarLine
} from "@remixicon/react";
import { useGetDepartmentProfileQuery, useRateDepartmentMutation } from '@/redux/departments/departmentsApi';
import { useGetSubscriberOrganizationQuery } from '@/redux/organizations/organizationsApi';
import { useState } from "react";
import ContentCard from "@/components/containers/ContentCard";
import Rating from "@/app/(dashboard)/hr/Rating.jsx";
import { translateDate } from '@/functions/Days';

function DepartmentProfile() {
    const { t, i18n } = useTranslation()
    const { slug: departmentId } = useParams();
    const { data: department, isLoading, error } = useGetDepartmentProfileQuery(departmentId);
    const { data: orgData } = useGetSubscriberOrganizationQuery();
    const [rateDepartment] = useRateDepartmentMutation();

    if (isLoading) return <div className="text-center py-10 font-medium">{t("Loading...")}</div>;
    if (error) return <div className="text-center py-10 text-red-500 font-medium">{t("Error loading department profile")}</div>;
    if (!department) return <div className="text-center py-10 font-medium">{t("Department not found")}</div>;

    const stats = department.stats || {};
    const employees = department.employees || [];

    const headerEmployees = [
        { label: t("Employee") },
        { label: t("Position") },
        { label: t("Role") },
        { label: t("Rating") },
    ];

    const employeeRows = employees.map(emp => [
        <div className="flex items-center gap-2" key={emp._id}>
            <img src={emp.imageProfile || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.user?.name || "U")}&background=random`} 
                 className="w-8 h-8 rounded-full object-cover border border-status-border" alt="" />
            <span className="text-sm font-medium text-cell-primary">{emp.user?.name || "-"}</span>
        </div>,
        <span className="text-sm text-cell-secondary" key={`pos-${emp._id}`}>{emp.position?.title || "-"}</span>,
        <span className="text-sm text-cell-secondary" key={`role-${emp._id}`}>{emp.user?.type || "-"}</span>,
        <Rating value={emp.overall_rating || 0} size={14} key={`rate-${emp._id}`} />
    ]);

    const headerRatings = [
        { label: t("Details") },
        { label: t("Date") },
        { label: t("Rating") },
        { label: t("Comment") },
    ];

    const ratingRows = department.ratings?.map((rating, idx) => [
        <span className="text-xs font-medium text-cell-primary" key={`det-${idx}`}>{rating.details || "-"}</span>,
        <span className="text-xs text-cell-secondary" key={`date-${idx}`}>{rating.created_at ? translateDate(rating.created_at) : "-"}</span>,
        <Rating value={rating.score || 0} size={14} key={`rate-${idx}`} />,
        <p className="text-[10px] text-cell-secondary truncate max-w-[120px]" key={`comm-${idx}`} title={rating.comment}>{rating.comment || "-"}</p>
    ]) || [];

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col gap-6"}>
                {/* Header Section */}
                <div className={"bg-surface rounded-2xl p-6 border border-status-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"}>
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary-50 dark:bg-primary-500/10 rounded-2xl border border-primary-100 dark:border-primary-500/20">
                            <RiBuilding2Line size={32} className="text-primary-base" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-cell-primary tracking-tight">{department.name}</h1>
                            <p className="text-cell-secondary text-sm mt-1 max-w-md line-clamp-2">{department.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 self-stretch md:self-auto border-t md:border-t-0 md:border-l border-status-border pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-3">
                             <span className="text-sm font-medium text-cell-secondary">{t("Overall Rating")}:</span>
                             <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-500/20">
                                <Rating value={department.overall_rating || 0} size={18} />
                                <span className="font-bold text-lg text-primary-base">{(department.overall_rating || 0).toFixed(1)}</span>
                             </div>
                        </div>
                        {department.evaluation_method === 'MANUAL' && (
                            <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                {t("Manual Override Active")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ContentCard
                        main={
                            <div className="flex items-center gap-4 p-1">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                    <RiTeamLine size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-cell-secondary uppercase tracking-wider">{t("Employees")}</p>
                                    <p className="text-2xl font-bold text-cell-primary mt-0.5">{stats.totalEmployees || 0}</p>
                                </div>
                            </div>
                        }
                    />
                    <ContentCard
                        main={
                            <div className="flex items-center gap-4 p-1">
                                <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl">
                                    <RiCheckDoubleLine size={24} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-cell-secondary uppercase tracking-wider">{t("Completion")}</p>
                                    <p className="text-2xl font-bold text-cell-primary mt-0.5">{stats.completedTasks || 0} <span className="text-sm font-normal text-cell-secondary">/ {stats.totalTasks || 0}</span></p>
                                </div>
                            </div>
                        }
                    />
                    <ContentCard
                        main={
                            <div className="flex items-center gap-4 p-1">
                                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                                    <RiLineChartLine size={24} className="text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-cell-secondary uppercase tracking-wider">{t("Success Rate")}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-2xl font-bold text-cell-primary">{stats.successRate || 0}%</p>
                                        <div className="flex-1 h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500" style={{width: `${stats.successRate || 0}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                    <ContentCard
                        main={
                            <div className="flex items-center gap-4 p-1">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
                                    <RiStarLine size={24} className="text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-cell-secondary uppercase tracking-wider">{t("Points")}</p>
                                    <p className="text-2xl font-bold text-cell-primary mt-0.5">{stats.totalPoints?.toFixed(0) || 0}</p>
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* Employees and History */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <ContentCard
                            title={t("Department Members")}
                            main={
                                <div className="mt-4 -mx-4">
                                    <Table 
                                        headers={headerEmployees} 
                                        rows={employeeRows} 
                                        isActions={false} 
                                        isCheckInput={false} 
                                        isTitle={false} 
                                        classContainer="border-0"
                                    />
                                </div>
                            }
                        />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                        <ContentCard
                            title={t("Rating History")}
                            main={
                                <div className="mt-4 -mx-4">
                                     <Table 
                                        headers={headerRatings} 
                                        rows={ratingRows} 
                                        isActions={false} 
                                        isCheckInput={false} 
                                        isTitle={false} 
                                        classContainer="border-0"
                                    />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default DepartmentProfile;
