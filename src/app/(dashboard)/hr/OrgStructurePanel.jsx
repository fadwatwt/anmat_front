"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";
import { useGetDepartmentsQuery } from "@/redux/departments/departmentsApi";
import { useGetOrgChartQuery, useGetCareerPathsQuery, useCreateCareerPathMutation, useSetCareerPathActiveMutation, useGetDevelopmentTargetsQuery, useGetOrgTransfersQuery, useScheduleOrgTransferMutation, useCancelOrgTransferMutation } from "@/redux/employees/orgStructureApi";

const idOf = (value) => String(value?._id || value || "");
const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const flatten = (roots = []) => roots.flatMap((node) => [node, ...flatten(node.reports)]);
function Person({ node, targets, positions }) {
  const target = targets.find((item) => idOf(item.employee_id) === node.employee_id);
  return <li className="min-w-56">
    <div className="rounded-xl border border-gray-200 bg-surface p-3 shadow-sm dark:border-gray-700">
      <strong>{node.name || node.employee_id}</strong>
      <div className="text-sm opacity-75">{node.position_title || "—"}{node.position_level ? ` · ${node.position_level}` : ""}</div>
      <div className="text-sm opacity-75">{node.department_name || "—"}</div>
      {target && <div className="text-xs text-primary-500">{positions.find((p) => idOf(p) === idOf(target.target_position_id))?.title || ""}</div>}
    </div>
    {node.reports?.length > 0 && <ul className="ms-5 mt-3 space-y-3 border-s border-gray-300 ps-5">{node.reports.map((child) => <Person key={child.employee_id} node={child} targets={targets} positions={positions} />)}</ul>}
  </li>;
}

export default function OrgStructurePanel() {
  const { t } = useTranslation();
  const canCreate = usePermission("positions.create");
  const canUpdate = usePermission("positions.update");
  const canViewPositions = usePermission("positions.list");
  const canViewTargets = usePermission("employee_development.create");
  const canTransfer = usePermission("employee_details.update");
  const canViewDepartments = usePermission("departments.list");
  const [date, setDate] = useState("");
  const [form, setForm] = useState({ from_position_id: "", to_position_id: "", requirements: "" });
  const [feedback, setFeedback] = useState("");
  const [transferForm, setTransferForm] = useState({ employee_id: "", effective_at: "", reason: "", manager_id: "", department_id: "", position_id: "" });
  const { data: chart, isLoading, error } = useGetOrgChartQuery(date || undefined, { pollingInterval: 60000 });
  const { data: currentChart } = useGetOrgChartQuery(undefined, { skip: !date });
  const { data: paths = [] } = useGetCareerPathsQuery(undefined, { skip: !canViewPositions });
  const { data: positions = [] } = useGetPositionsQuery(undefined, { skip: !canViewPositions });
  const { data: departments = [] } = useGetDepartmentsQuery(undefined, { skip: !canViewDepartments });
  const { data: transfers = [] } = useGetOrgTransfersQuery(undefined, { pollingInterval: 60000 });
  const { data: targets = [] } = useGetDevelopmentTargetsQuery(undefined, { skip: !canViewTargets });
  const [createPath, { isLoading: saving }] = useCreateCareerPathMutation();
  const [setActive] = useSetCareerPathActiveMutation();
  const [scheduleTransfer, { isLoading: scheduling }] = useScheduleOrgTransferMutation();
  const [cancelTransfer] = useCancelOrgTransferMutation();
  const currentPeople = flatten((date ? currentChart : chart)?.roots);
  const selectedPerson = currentPeople.find((person) => person.employee_id === transferForm.employee_id);
  const selectedDepartment = transferForm.department_id || selectedPerson?.department_id;
  const availablePositions = positions.filter((position) => !selectedDepartment || departments.find((department) => idOf(department) === selectedDepartment)?.positions_ids?.some((id) => idOf(id) === idOf(position)));
  const positionName = (id) => positions.find((position) => idOf(position) === idOf(id))?.title || idOf(id);
  const save = async (event) => {
    event.preventDefault(); setFeedback("");
    try { await createPath(form).unwrap(); setForm({ from_position_id: "", to_position_id: "", requirements: "" }); setFeedback(t("Career path saved")); }
    catch (e) { setFeedback(e?.data?.message || t("Operation failed")); }
  };
  const saveTransfer = async (event) => {
    event.preventDefault(); setFeedback("");
    const body = { employee_id: transferForm.employee_id, effective_at: new Date(`${transferForm.effective_at}T00:00:00`).toISOString(), reason: transferForm.reason.trim() };
    for (const key of ["manager_id", "department_id", "position_id"]) {
      if (transferForm[key] === "__clear__") body[key] = null;
      else if (transferForm[key]) body[key] = transferForm[key];
    }
    try { await scheduleTransfer(body).unwrap(); setTransferForm({ employee_id: "", effective_at: "", reason: "", manager_id: "", department_id: "", position_id: "" }); setFeedback(t("Transfer scheduled")); }
    catch (e) { setFeedback(e?.data?.message || t("Operation failed")); }
  };
  return <div className="space-y-6 p-4">
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1"><span>{t("Structure date")}</span><input className={field} type="date" max={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
      <span className="text-sm opacity-70">{chart?.count ?? 0} {t("Employees")}</span>
    </div>
    {isLoading && <p>{t("Loading...")}</p>}
    {error && <p role="alert">{error?.data?.message || t("Operation failed")}</p>}
    <div className="overflow-x-auto"><ul className="flex items-start gap-5">{chart?.roots?.map((node) => <Person key={node.employee_id} node={node} targets={targets} positions={positions} />)}</ul></div>
    {canTransfer && <section className="space-y-3">
      <h3 className="text-lg font-semibold">{t("Scheduled transfers")}</h3>
      <form className="flex flex-wrap items-end gap-2" onSubmit={saveTransfer}>
        <label className="flex flex-col gap-1">{t("Employee")}<select required className={field} value={transferForm.employee_id} onChange={(e) => setTransferForm({ ...transferForm, employee_id: e.target.value })}><option value="">—</option>{currentPeople.map((person) => <option key={person.employee_id} value={person.employee_id}>{person.name}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Effective date")}<input required type="date" min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} className={field} value={transferForm.effective_at} onChange={(e) => setTransferForm({ ...transferForm, effective_at: e.target.value })} /></label>
        <label className="flex flex-col gap-1">{t("New manager")}<select className={field} value={transferForm.manager_id} onChange={(e) => setTransferForm({ ...transferForm, manager_id: e.target.value })}><option value="">{t("No change")}</option><option value="__clear__">{t("Clear assignment")}</option>{currentPeople.filter((person) => person.employee_id !== transferForm.employee_id).map((person) => <option key={person.employee_id} value={person.employee_id}>{person.name}</option>)}</select></label>
        {canViewDepartments && <label className="flex flex-col gap-1">{t("New department")}<select className={field} value={transferForm.department_id} onChange={(e) => setTransferForm({ ...transferForm, department_id: e.target.value, position_id: e.target.value ? "__clear__" : "" })}><option value="">{t("No change")}</option><option value="__clear__">{t("Clear assignment")}</option>{departments.map((department) => <option key={idOf(department)} value={idOf(department)}>{department.name}</option>)}</select></label>}
        {canViewPositions && <label className="flex flex-col gap-1">{t("New position")}<select className={field} value={transferForm.position_id} onChange={(e) => setTransferForm({ ...transferForm, position_id: e.target.value })}><option value="">{t("No change")}</option><option value="__clear__">{t("Clear assignment")}</option>{availablePositions.map((position) => <option key={idOf(position)} value={idOf(position)}>{position.title}</option>)}</select></label>}
        <label className="flex flex-col gap-1">{t("Reason")}<input required maxLength={300} className={field} value={transferForm.reason} onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })} /></label>
        <button disabled={scheduling} className="rounded-lg bg-primary-500 px-4 py-2 text-white">{t("Schedule transfer")}</button>
      </form>
      <div className="space-y-2">{transfers.map((transfer) => <div key={idOf(transfer)} className="flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm">
        <strong>{currentPeople.find((person) => person.employee_id === idOf(transfer.employee_id))?.name || idOf(transfer.employee_id)}</strong>
        <span>{new Date(transfer.effective_at).toLocaleDateString()}</span><span>{transfer.reason}</span><span>{t(transfer.status)}</span>
        {transfer.conflict_reason && <span role="alert">{transfer.conflict_reason}</span>}
        {transfer.status === "SCHEDULED" && <button className="rounded border px-2 py-1" onClick={async () => { try { await cancelTransfer(idOf(transfer)).unwrap(); } catch (e) { setFeedback(e?.data?.message || t("Operation failed")); } }}>{t("Cancel transfer")}</button>}
      </div>)}</div>
    </section>}
    {canViewPositions && <section className="space-y-3">
      <h3 className="text-lg font-semibold">{t("Career paths")}</h3>
      {canCreate && <form onSubmit={save} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("From position")}<select required className={field} value={form.from_position_id} onChange={(e) => setForm({ ...form, from_position_id: e.target.value })}><option value="">—</option>{positions.map((p) => <option key={idOf(p)} value={idOf(p)}>{p.title} · {p.level || 1}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Target position")}<select required className={field} value={form.to_position_id} onChange={(e) => setForm({ ...form, to_position_id: e.target.value })}><option value="">—</option>{positions.map((p) => <option key={idOf(p)} value={idOf(p)}>{p.title} · {p.level || 1}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Requirements")}<input className={field} maxLength={500} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></label>
        <button disabled={saving} className="rounded-lg bg-primary-500 px-4 py-2 text-white">{t("Save")}</button>
      </form>}
      {feedback && <p role="status">{feedback}</p>}
      <div className="space-y-2">{paths.map((path) => <div key={idOf(path)} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
        <span>{positionName(path.from_position_id)} → {positionName(path.to_position_id)}</span>
        {path.requirements && <span className="text-sm opacity-70">{path.requirements}</span>}
        <span className="text-sm">{path.active ? t("Active") : t("Inactive")}</span>
        {canUpdate && <button className="rounded border px-2 py-1" onClick={async () => { try { await setActive({ id: idOf(path), active: !path.active }).unwrap(); } catch (e) { setFeedback(e?.data?.message || t("Operation failed")); } }}>{path.active ? t("Deactivate") : t("Activate")}</button>}
      </div>)}</div>
    </section>}
  </div>;
}
