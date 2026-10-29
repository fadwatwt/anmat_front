"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserId, selectUserType } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";
import {
  useGetDevelopmentPlansQuery, useCreateDevelopmentPlanMutation,
  useActivateDevelopmentPlanMutation, useUpdateDevelopmentSkillMutation,
  useUpdateDevelopmentActionMutation, useAddDevelopmentCheckInMutation,
  useCompleteDevelopmentPlanMutation,
} from "@/redux/employees/developmentApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const idOf = (value) => String(value?._id || value || "");
const dateTime = (value) => `${value}T00:00:00.000Z`;
const messageOf = (error) => {
  const message = error?.data?.message || error?.message;
  return Array.isArray(message) ? message.join("، ") : message || "Operation failed";
};
const emptySkill = { skill: "", current_level: 0, target_level: 1 };
const emptyAction = { title: "", type: "TRAINING", is_required: true, due_at: "" };

export default function DevelopmentPanel() {
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);
  const canCreate = usePermission("employee_development.create");
  const canUpdate = usePermission("employee_development.update");
  const canEvaluate = usePermission("employee_development.evaluate");
  const canListEmployees = usePermission("employee_details.list");
  const canListPositions = usePermission("positions.list");
  const { data: plans = [], isLoading, error } = useGetDevelopmentPlansQuery();
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canCreate || !canListEmployees });
  const { data: positions = [] } = useGetPositionsQuery(undefined, { skip: !canCreate || !canListPositions });
  const [createPlan] = useCreateDevelopmentPlanMutation();
  const [activatePlan] = useActivateDevelopmentPlanMutation();
  const [updateSkill] = useUpdateDevelopmentSkillMutation();
  const [updateAction] = useUpdateDevelopmentActionMutation();
  const [addCheckIn] = useAddDevelopmentCheckInMutation();
  const [completePlan] = useCompleteDevelopmentPlanMutation();
  const [form, setForm] = useState({ employee_id: "", title: "", starts_at: "", target_date: "", target_position_id: "" });
  const [skills, setSkills] = useState([{ ...emptySkill }]);
  const [actions, setActions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const people = employees.filter((employee) => employee.registration_status !== "pending" && employee.user_id);
  const personName = (id) => people.find((employee) => idOf(employee.user_id) === idOf(id))?.user?.name || idOf(id);
  const shownPlans = userType === "Subscriber" || canCreate || canEvaluate
    ? plans
    : plans.filter((plan) => idOf(plan.employee_id) === idOf(userId) || idOf(plan.manager_id) === idOf(userId));
  const setDraft = (id, patch) => setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  const execute = async (action, success) => {
    setBusy(true); setFeedback("");
    try { await action(); setFeedback(t(success)); }
    catch (caught) { setFeedback(messageOf(caught)); }
    finally { setBusy(false); }
  };

  const submitPlan = (event) => {
    event.preventDefault();
    const skill_objectives = skills.filter((entry) => entry.skill.trim()).map((entry) => ({ skill: entry.skill.trim(), current_level: Number(entry.current_level), target_level: Number(entry.target_level) }));
    const planActions = actions.filter((entry) => entry.title.trim()).map((entry) => ({ title: entry.title.trim(), type: entry.type, is_required: entry.is_required, ...(entry.due_at ? { due_at: dateTime(entry.due_at) } : {}) }));
    if (!skill_objectives.length && !planActions.length) { setFeedback(t("Add a skill or action")); return; }
    if (skill_objectives.some((entry) => entry.target_level <= entry.current_level)) { setFeedback(t("Target level must exceed current level")); return; }
    execute(async () => {
      await createPlan({ employee_id: form.employee_id, title: form.title, starts_at: dateTime(form.starts_at), target_date: dateTime(form.target_date), ...(form.target_position_id ? { target_position_id: form.target_position_id } : {}), skill_objectives, actions: planActions }).unwrap();
      setForm({ employee_id: "", title: "", starts_at: "", target_date: "", target_position_id: "" });
      setSkills([{ ...emptySkill }]); setActions([]);
    }, "Development plan created");
  };

  if (isLoading) return <p>{t("Loading...")}</p>;
  if (error) return <p role="alert" className="text-red-600">{messageOf(error)}</p>;

  return <div className="space-y-6" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}
    {canCreate && canListEmployees && <form onSubmit={submitPlan} className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-cell-primary">{t("Create development plan")}</h2>
      <div className="flex flex-wrap gap-3">
        <select className={field} required value={form.employee_id} onChange={(event) => setForm({ ...form, employee_id: event.target.value })} aria-label={t("Employee")}><option value="">{t("Select employee")}</option>{people.map((employee) => <option key={employee._id} value={employee.user_id}>{employee.user?.name || employee.user?.email}</option>)}</select>
        <input className={field} required minLength={2} maxLength={120} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder={t("Plan title")} aria-label={t("Plan title")} />
        <label className="text-sm text-cell-primary">{t("Start date")} <input className={field} required type="date" value={form.starts_at} onChange={(event) => setForm({ ...form, starts_at: event.target.value })} /></label>
        <label className="text-sm text-cell-primary">{t("Target date")} <input className={field} required type="date" min={form.starts_at || undefined} value={form.target_date} onChange={(event) => setForm({ ...form, target_date: event.target.value })} /></label>
        {canListPositions && <select className={field} value={form.target_position_id} onChange={(event) => setForm({ ...form, target_position_id: event.target.value })} aria-label={t("Target position")}><option value="">{t("No target position")}</option>{positions.map((position) => <option key={position._id} value={position._id}>{position.name}</option>)}</select>}
      </div>
      <h3 className="font-semibold text-cell-primary">{t("Skill objectives")}</h3>
      {skills.map((skill, index) => <div key={index} className="flex flex-wrap gap-2">
        <input className={field} minLength={2} maxLength={120} value={skill.skill} onChange={(event) => setSkills(skills.map((row, i) => i === index ? { ...row, skill: event.target.value } : row))} placeholder={t("Skill")} aria-label={t("Skill")} />
        <label className="text-sm text-cell-primary">{t("Current level")} <input className={`${field} w-20`} type="number" min={0} max={10} value={skill.current_level} onChange={(event) => setSkills(skills.map((row, i) => i === index ? { ...row, current_level: event.target.value } : row))} /></label>
        <label className="text-sm text-cell-primary">{t("Target level")} <input className={`${field} w-20`} type="number" min={1} max={10} value={skill.target_level} onChange={(event) => setSkills(skills.map((row, i) => i === index ? { ...row, target_level: event.target.value } : row))} /></label>
        <button type="button" className="text-red-600" onClick={() => setSkills(skills.filter((_, i) => i !== index))}>{t("Remove")}</button>
      </div>)}
      <button type="button" className={field} onClick={() => setSkills([...skills, { ...emptySkill }])}>{t("Add skill")}</button>
      <h3 className="font-semibold text-cell-primary">{t("Development actions")}</h3>
      {actions.map((action, index) => <div key={index} className="flex flex-wrap gap-2">
        <input className={field} minLength={2} maxLength={160} value={action.title} onChange={(event) => setActions(actions.map((row, i) => i === index ? { ...row, title: event.target.value } : row))} placeholder={t("Action title")} aria-label={t("Action title")} />
        <select className={field} value={action.type} onChange={(event) => setActions(actions.map((row, i) => i === index ? { ...row, type: event.target.value } : row))} aria-label={t("Action type")}>{["TRAINING", "MENTORING", "PROJECT", "CERTIFICATION", "SELF_STUDY", "OTHER"].map((type) => <option key={type} value={type}>{t(type)}</option>)}</select>
        <input className={field} type="date" value={action.due_at} onChange={(event) => setActions(actions.map((row, i) => i === index ? { ...row, due_at: event.target.value } : row))} aria-label={t("Due date")} />
        <label className="text-sm text-cell-primary"><input type="checkbox" checked={action.is_required} onChange={(event) => setActions(actions.map((row, i) => i === index ? { ...row, is_required: event.target.checked } : row))} /> {t("Required")}</label>
        <button type="button" className="text-red-600" onClick={() => setActions(actions.filter((_, i) => i !== index))}>{t("Remove")}</button>
      </div>)}
      <div className="flex gap-2"><button type="button" className={field} onClick={() => setActions([...actions, { ...emptyAction }])}>{t("Add action")}</button><button className={button} disabled={busy}>{t("Create plan")}</button></div>
    </form>}

    <section className="space-y-4"><h2 className="text-lg font-semibold text-cell-primary">{t("Development plans")}</h2>
      {!shownPlans.length && <p className="text-cell-secondary">{t("No development plans yet")}</p>}
      {shownPlans.map((plan) => {
        const draft = drafts[plan._id] || {};
        const isOwner = idOf(plan.employee_id) === idOf(userId) || idOf(plan.manager_id) === idOf(userId);
        const active = plan.status === "ACTIVE";
        const requiredDone = plan.skill_objectives?.every((item) => item.status === "COMPLETED" || item.status === "CANCELLED") && plan.actions?.every((item) => !item.is_required || item.status === "COMPLETED");
        return <article key={plan._id} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-cell-primary">{plan.title} · {personName(plan.employee_id)}</h3><span className="text-sm text-cell-secondary">{t(plan.status)}</span></div>
          {plan.target_position_id && <p className="text-sm text-cell-secondary">{t("Target position")}: {positions.find((position) => idOf(position._id) === idOf(plan.target_position_id))?.name || idOf(plan.target_position_id)}</p>}
          {plan.status === "DRAFT" && canUpdate && <button type="button" className={button} disabled={busy} onClick={() => execute(() => activatePlan(plan._id).unwrap(), "Development plan activated")}>{t("Activate plan")}</button>}
          {plan.skill_objectives?.map((skill) => <div key={skill._id} className="flex flex-wrap items-center gap-2 rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
            <span className="min-w-40">{skill.skill} · {skill.current_level} → {skill.target_level}</span><span>{skill.progress}% · {t(skill.status)}</span>
            {active && canUpdate && isOwner && skill.status !== "CANCELLED" && <><input className={`${field} w-20`} type="number" min={0} max={100} value={draft[`skill-${skill._id}`] ?? skill.progress} onChange={(event) => setDraft(plan._id, { [`skill-${skill._id}`]: event.target.value })} aria-label={`${skill.skill} ${t("Progress")}`} /><button type="button" className={button} disabled={busy} onClick={() => execute(() => updateSkill({ planId: plan._id, skillId: skill._id, body: { progress: Number(draft[`skill-${skill._id}`] ?? skill.progress) } }).unwrap(), "Skill progress saved")}>{t("Save progress")}</button></>}
          </div>)}
          {plan.actions?.map((action) => <div key={action._id} className="flex flex-wrap items-center gap-2 rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
            <span className="min-w-40">{action.title} · {t(action.type)}</span><span>{action.progress}% · {t(action.status)}</span>
            {active && canUpdate && isOwner && action.status !== "CANCELLED" && <><input className={`${field} w-20`} type="number" min={0} max={100} value={draft[`action-${action._id}`] ?? action.progress} onChange={(event) => setDraft(plan._id, { [`action-${action._id}`]: event.target.value })} aria-label={`${action.title} ${t("Progress")}`} /><button type="button" className={button} disabled={busy} onClick={() => execute(() => updateAction({ planId: plan._id, actionId: action._id, body: { progress: Number(draft[`action-${action._id}`] ?? action.progress) } }).unwrap(), "Action progress saved")}>{t("Save progress")}</button></>}
          </div>)}
          {active && canUpdate && isOwner && <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); execute(() => addCheckIn({ planId: plan._id, body: { note: draft.checkIn, next_steps: draft.nextSteps || "" } }).unwrap(), "Check-in saved"); }}>
            <input className={field} required minLength={2} maxLength={1000} placeholder={t("Check-in note")} aria-label={t("Check-in note")} value={draft.checkIn || ""} onChange={(event) => setDraft(plan._id, { checkIn: event.target.value })} />
            <input className={field} maxLength={1000} placeholder={t("Next steps")} aria-label={t("Next steps")} value={draft.nextSteps || ""} onChange={(event) => setDraft(plan._id, { nextSteps: event.target.value })} />
            <button className={button} disabled={busy}>{t("Record check-in")}</button>
          </form>}
          {!!plan.check_ins?.length && <div className="space-y-1"><h4 className="font-semibold text-cell-primary">{t("Check-ins")}</h4>{plan.check_ins.map((checkIn) => <p key={checkIn._id} className="text-sm text-cell-secondary">{new Date(checkIn.recorded_at).toLocaleDateString()} · {checkIn.overall_progress}% · {checkIn.note}{checkIn.next_steps ? ` · ${checkIn.next_steps}` : ""}</p>)}</div>}
          {active && canEvaluate && requiredDone && <button type="button" className={button} disabled={busy} onClick={() => execute(() => completePlan(plan._id).unwrap(), "Development plan completed")}>{t("Complete plan")}</button>}
        </article>;
      })}
    </section>
  </div>;
}
