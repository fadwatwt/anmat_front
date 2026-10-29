"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
  useGetLifecycleTemplatesQuery,
  useCreateLifecycleTemplateMutation,
  useGetLifecycleCasesQuery,
  useStartLifecycleCaseMutation,
  useCompleteLifecycleItemMutation,
} from "@/redux/employees/lifecycleApi";

const today = () => new Date().toISOString().slice(0, 10);
const errorText = (error) => {
  const message = error?.data?.message || error?.message;
  return Array.isArray(message) ? message.join("، ") : message || "تعذر إتمام العملية";
};
const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";

export default function LifecyclePanel() {
  const { t } = useTranslation();
  const canManage = usePermission("employee_lifecycle.manage_settings");
  const canCreate = usePermission("employee_lifecycle.create");
  const canUpdate = usePermission("employee_lifecycle.update");
  const canListEmployees = usePermission("employee_details.list");
  const { data: templates = [], isLoading: loadingTemplates, error: templatesError } = useGetLifecycleTemplatesQuery();
  const { data: cases = [], isLoading: loadingCases, error: casesError } = useGetLifecycleCasesQuery();
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canCreate || !canListEmployees });
  const [createTemplate, { isLoading: creatingTemplate }] = useCreateLifecycleTemplateMutation();
  const [startCase, { isLoading: startingCase }] = useStartLifecycleCaseMutation();
  const [completeItem, { isLoading: completingItem }] = useCompleteLifecycleItemMutation();
  const [feedback, setFeedback] = useState("");
  const [template, setTemplate] = useState({ name: "", type: "ONBOARDING" });
  const [tasks, setTasks] = useState([{ title: "", owner_type: "HR", due_offset_days: 0, is_required: true, requires_evidence: false }]);
  const [caseForm, setCaseForm] = useState({ employee_id: "", template_id: "", start_date: today() });
  const [completion, setCompletion] = useState({});
  const activeEmployees = employees.filter((employee) => employee.registration_status !== "pending" && employee.user_id);
  const employeeName = (id) => activeEmployees.find((employee) => String(employee.user_id) === String(id))?.user?.name || id;
  const activeTemplates = templates.filter((entry) => entry.is_active);
  const selectedTemplate = activeTemplates.find((entry) => entry._id === caseForm.template_id);
  const matchingEmployees = selectedTemplate
    ? activeEmployees.filter((employee) =>
      (!selectedTemplate.department_id || String(selectedTemplate.department_id) === String(employee.department_id)) &&
      (!selectedTemplate.position_id || String(selectedTemplate.position_id) === String(employee.position_id)))
    : activeEmployees;

  const saveTemplate = async (event) => {
    event.preventDefault();
    setFeedback("");
    try {
      await createTemplate({ ...template, tasks }).unwrap();
      setTemplate({ name: "", type: "ONBOARDING" });
      setTasks([{ title: "", owner_type: "HR", due_offset_days: 0, is_required: true, requires_evidence: false }]);
      setFeedback(t("Template created successfully"));
    } catch (error) { setFeedback(errorText(error)); }
  };

  const createCase = async (event) => {
    event.preventDefault();
    setFeedback("");
    try {
      await startCase({ ...caseForm, start_date: `${caseForm.start_date}T00:00:00.000Z` }).unwrap();
      setFeedback(t("Employee process started successfully"));
    } catch (error) { setFeedback(errorText(error)); }
  };

  const finishItem = async (lifecycleCase, item) => {
    setFeedback("");
    try {
      await completeItem({
        caseId: lifecycleCase._id,
        itemId: item._id,
        body: {
          completion_note: completion[item._id]?.note || "",
          evidence_reference: completion[item._id]?.evidence || "",
        },
      }).unwrap();
      setFeedback(t("Task completed successfully"));
    } catch (error) { setFeedback(errorText(error)); }
  };

  if (loadingTemplates || loadingCases) return <p>{t("Loading...")}</p>;
  if (templatesError || casesError) return <p role="alert" className="text-red-600">{errorText(templatesError || casesError)}</p>;

  return <div className="space-y-6" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}

    {canManage && <form onSubmit={saveTemplate} className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-cell-primary">{t("Lifecycle templates")}</h2>
      <div className="flex flex-wrap gap-3">
        <input className={field} required minLength={2} maxLength={120} value={template.name} onChange={(event) => setTemplate({ ...template, name: event.target.value })} placeholder={t("Template name")} aria-label={t("Template name")} />
        <select className={field} value={template.type} onChange={(event) => setTemplate({ ...template, type: event.target.value })} aria-label={t("Process type")}>
          <option value="ONBOARDING">{t("Onboarding")}</option><option value="OFFBOARDING">{t("Offboarding")}</option>
        </select>
      </div>
      {tasks.map((task, index) => <div key={index} className="flex flex-wrap items-center gap-2 rounded-lg bg-status-bg p-3">
        <input className={field} required minLength={2} maxLength={160} value={task.title} onChange={(event) => setTasks(tasks.map((row, i) => i === index ? { ...row, title: event.target.value } : row))} placeholder={t("Task title")} aria-label={t("Task title")} />
        <select className={field} value={task.owner_type} onChange={(event) => setTasks(tasks.map((row, i) => i === index ? { ...row, owner_type: event.target.value } : row))} aria-label={t("Task owner")}>
          {["HR", "MANAGER", "IT", "EMPLOYEE"].map((owner) => <option key={owner} value={owner}>{t(owner)}</option>)}
        </select>
        <label className="text-sm text-cell-primary">{t("Due after days")} <input className={`${field} w-20`} type="number" min={-365} max={365} value={task.due_offset_days} onChange={(event) => setTasks(tasks.map((row, i) => i === index ? { ...row, due_offset_days: Number(event.target.value) } : row))} /></label>
        <label className="text-sm text-cell-primary"><input type="checkbox" checked={task.is_required} onChange={(event) => setTasks(tasks.map((row, i) => i === index ? { ...row, is_required: event.target.checked } : row))} /> {t("Required")}</label>
        <label className="text-sm text-cell-primary"><input type="checkbox" checked={task.requires_evidence} onChange={(event) => setTasks(tasks.map((row, i) => i === index ? { ...row, requires_evidence: event.target.checked } : row))} /> {t("Requires evidence")}</label>
        {tasks.length > 1 && <button type="button" onClick={() => setTasks(tasks.filter((_, i) => i !== index))} className="text-red-600">{t("Remove")}</button>}
      </div>)}
      <div className="flex gap-2"><button type="button" className={field} onClick={() => setTasks([...tasks, { title: "", owner_type: "HR", due_offset_days: 0, is_required: true, requires_evidence: false }])}>{t("Add task")}</button><button className={button} disabled={creatingTemplate}>{t("Save template")}</button></div>
    </form>}

    {canCreate && canListEmployees && <form onSubmit={createCase} className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="w-full text-lg font-semibold text-cell-primary">{t("Start employee process")}</h2>
      <label className="flex flex-col gap-1 text-sm text-cell-primary">{t("Template")}<select required className={field} value={caseForm.template_id} onChange={(event) => setCaseForm({ ...caseForm, template_id: event.target.value, employee_id: "" })}><option value="">{t("Select template")}</option>{activeTemplates.map((entry) => <option key={entry._id} value={entry._id}>{entry.name} — {t(entry.type)}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm text-cell-primary">{t("Employee")}<select required className={field} value={caseForm.employee_id} onChange={(event) => setCaseForm({ ...caseForm, employee_id: event.target.value })}><option value="">{t("Select employee")}</option>{matchingEmployees.map((employee) => <option key={employee._id} value={employee.user_id}>{employee.user?.name || employee.user?.email}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm text-cell-primary">{t("Start date")}<input required type="date" className={field} value={caseForm.start_date} onChange={(event) => setCaseForm({ ...caseForm, start_date: event.target.value })} /></label>
      <button className={button} disabled={startingCase || !activeTemplates.length}>{t("Start")}</button>
    </form>}

    <section className="space-y-3"><h2 className="text-lg font-semibold text-cell-primary">{t("Employee processes and overdue tasks")}</h2>
      {!cases.length && <p className="text-cell-secondary">{t("No employee processes yet")}</p>}
      {cases.map((entry) => <article key={entry._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-cell-primary">{entry.template_name} — {employeeName(entry.employee_id)}</h3><span className="text-sm text-cell-secondary">{t(entry.status)}</span></div>
        <ul className="mt-3 space-y-3">{entry.checklist?.map((item) => {
          const dueEnd = new Date(item.due_at);
          dueEnd.setHours(23, 59, 59, 999);
          const overdue = item.status === "PENDING" && dueEnd.getTime() < Date.now();
          return <li key={item._id} className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
            <div className="flex flex-wrap justify-between gap-2"><span>{item.title} · {t(item.owner_type)}</span><span className={overdue ? "font-semibold text-red-600" : "text-cell-secondary"}>{overdue ? `${t("Overdue")} · ` : ""}{new Date(item.due_at).toLocaleDateString()} · {t(item.status)}</span></div>
            {item.status === "PENDING" && entry.status === "ACTIVE" && canUpdate && <div className="mt-2 flex flex-wrap gap-2">
              <input className={field} maxLength={500} placeholder={t("Completion note")} aria-label={t("Completion note")} value={completion[item._id]?.note || ""} onChange={(event) => setCompletion({ ...completion, [item._id]: { ...completion[item._id], note: event.target.value } })} />
              {item.requires_evidence && <input className={field} required maxLength={500} placeholder={t("Evidence reference")} aria-label={t("Evidence reference")} value={completion[item._id]?.evidence || ""} onChange={(event) => setCompletion({ ...completion, [item._id]: { ...completion[item._id], evidence: event.target.value } })} />}
              <button type="button" className={button} disabled={completingItem || (item.requires_evidence && !completion[item._id]?.evidence?.trim())} onClick={() => finishItem(entry, item)}>{t("Complete")}</button>
            </div>}
          </li>;
        })}</ul>
      </article>)}
    </section>
  </div>;
}
