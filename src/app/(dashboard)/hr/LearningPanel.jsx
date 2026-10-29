"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import { useGetPositionsQuery } from "@/redux/positions/positionsApi";
import { useGetDevelopmentPlansQuery } from "@/redux/employees/developmentApi";
import { useGetLearningSkillsQuery, useCreateLearningSkillMutation, useSetLearningSkillStatusMutation,
  useGetPositionSkillsQuery, useSetPositionSkillMutation, useRemovePositionSkillMutation, useGetEmployeeSkillsQuery, useAssessEmployeeSkillMutation,
  useGetLearningCoursesQuery, useCreateLearningCourseMutation, useSetLearningCourseStatusMutation,
  useGetLearningEnrollmentsQuery, useEnrollLearningEmployeeMutation, useCompleteLearningEnrollmentMutation,
  useGetLearningGapsQuery, useGetMyLearningGapsQuery } from "@/redux/employees/learningApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const idOf = (value) => String(value?._id || value || "");
const messageOf = (error) => { const message = error?.data?.message || error?.message; return Array.isArray(message) ? message.join("، ") : message || "Operation failed"; };

export default function LearningPanel() {
  const { t } = useTranslation();
  const canList = usePermission("learning.list");
  const canCreate = usePermission("learning.create");
  const canUpdate = usePermission("learning.update");
  const canAssess = usePermission("learning.evaluate");
  const canAssign = usePermission("learning.assign");
  const canListEmployees = usePermission("employee_details.list");
  const canListPositions = usePermission("positions.list");
  const canListPlans = usePermission("employee_development.list");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [skill, setSkill] = useState({ name: "", description: "" });
  const [requirement, setRequirement] = useState({ position_id: "", skill_id: "", target_level: 1 });
  const [assessment, setAssessment] = useState({ employee_id: "", skill_id: "", current_level: 0, target_level: "" });
  const [course, setCourse] = useState({ title: "", description: "", skill_ids: [], materials: [] });
  const [enrollment, setEnrollment] = useState({ employee_id: "", course_id: "", development_plan_id: "", development_action_id: "" });
  const [completionDrafts, setCompletionDrafts] = useState({});

  const { data: skills = [], isLoading: loadingSkills, error: skillError } = useGetLearningSkillsQuery();
  const { data: positionSkills = [] } = useGetPositionSkillsQuery();
  const { data: employeeSkills = [] } = useGetEmployeeSkillsQuery();
  const { data: courses = [] } = useGetLearningCoursesQuery();
  const { data: enrollments = [] } = useGetLearningEnrollmentsQuery();
  const { data: gaps } = useGetLearningGapsQuery(undefined, { skip: !canList });
  const { data: myGaps } = useGetMyLearningGapsQuery(undefined, { skip: canList });
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canListEmployees || !(canAssign || canAssess || canList) });
  const { data: positions = [] } = useGetPositionsQuery(undefined, { skip: !canListPositions || !(canUpdate || canList) });
  const { data: plans = [] } = useGetDevelopmentPlansQuery(undefined, { skip: !canListPlans || !canAssign });
  const [createSkill] = useCreateLearningSkillMutation();
  const [setSkillActive] = useSetLearningSkillStatusMutation();
  const [setPositionSkill] = useSetPositionSkillMutation();
  const [removePositionSkill] = useRemovePositionSkillMutation();
  const [assessSkill] = useAssessEmployeeSkillMutation();
  const [createCourse] = useCreateLearningCourseMutation();
  const [setCourseActive] = useSetLearningCourseStatusMutation();
  const [enrollEmployee] = useEnrollLearningEmployeeMutation();
  const [completeEnrollment] = useCompleteLearningEnrollmentMutation();

  const people = employees.filter((item) => item.user_id && item.registration_status !== "pending");
  const personName = (id) => people.find((item) => idOf(item.user_id) === idOf(id))?.user?.name || idOf(id);
  const skillName = (id) => skills.find((item) => idOf(item) === idOf(id))?.name || idOf(id);
  const courseName = (id) => courses.find((item) => idOf(item) === idOf(id))?.title || idOf(id);
  const activeSkills = skills.filter((item) => item.active);
  const activeCourses = courses.filter((item) => item.active);
  const selectedPlans = plans.filter((plan) => idOf(plan.employee_id) === enrollment.employee_id && ["DRAFT", "ACTIVE"].includes(plan.status));
  const selectedPlan = selectedPlans.find((plan) => idOf(plan) === enrollment.development_plan_id);
  const run = async (action, success) => {
    setBusy(true); setFeedback("");
    try { await action(); setFeedback(t(success)); } catch (error) { setFeedback(t(messageOf(error))); }
    finally { setBusy(false); }
  };
  const submitSkill = (event) => { event.preventDefault(); run(async () => { await createSkill(skill).unwrap(); setSkill({ name: "", description: "" }); }, "Skill saved"); };
  const submitRequirement = (event) => { event.preventDefault(); run(async () => { await setPositionSkill({ ...requirement, target_level: Number(requirement.target_level) }).unwrap(); }, "Position skill saved"); };
  const submitAssessment = (event) => { event.preventDefault(); run(async () => {
    await assessSkill({ ...assessment, current_level: Number(assessment.current_level),
      ...(assessment.target_level !== "" ? { target_level: Number(assessment.target_level) } : {}) }).unwrap();
  }, "Employee skill saved"); };
  const submitCourse = (event) => { event.preventDefault(); run(async () => {
    await createCourse({ title: course.title, description: course.description, skill_ids: course.skill_ids,
      materials: course.materials.filter((material) => material.title && material.url) }).unwrap();
    setCourse({ title: "", description: "", skill_ids: [], materials: [] });
  }, "Course saved"); };
  const submitEnrollment = (event) => { event.preventDefault(); run(async () => {
    await enrollEmployee({ employee_id: enrollment.employee_id, course_id: enrollment.course_id,
      ...(enrollment.development_plan_id ? { development_plan_id: enrollment.development_plan_id } : {}),
      ...(enrollment.development_action_id ? { development_action_id: enrollment.development_action_id } : {}) }).unwrap();
    setEnrollment({ employee_id: "", course_id: "", development_plan_id: "", development_action_id: "" });
  }, "Enrollment saved"); };
  const report = canList ? gaps : myGaps;

  return <div className="space-y-6 p-4">
    {loadingSkills && <p>{t("Loading...")}</p>}
    {skillError && <p role="alert">{t(messageOf(skillError))}</p>}
    {feedback && <p role="status">{feedback}</p>}
    <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Skill catalog")}</h3>
      {canCreate && <form onSubmit={submitSkill} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("Skill name")}<input required maxLength={120} className={field} value={skill.name} onChange={(e) => setSkill({ ...skill, name: e.target.value })} /></label>
        <label className="flex flex-col gap-1">{t("Description")}<input maxLength={500} className={field} value={skill.description} onChange={(e) => setSkill({ ...skill, description: e.target.value })} /></label>
        <button disabled={busy} className={button}>{t("Save")}</button>
      </form>}
      <div className="flex flex-wrap gap-2">{skills.map((item) => <div key={idOf(item)} className="rounded-lg border p-2">
        <strong>{item.name}</strong>{item.description && <span className="ms-2 text-sm opacity-70">{item.description}</span>}
        {!item.active && <span className="ms-2 text-sm">{t("Inactive")}</span>}
        {canUpdate && <button className="ms-2 rounded border px-2 py-1 text-sm" onClick={() => run(() => setSkillActive({ id: idOf(item), active: !item.active }).unwrap(), "Skill updated")}>{item.active ? t("Deactivate") : t("Activate")}</button>}
      </div>)}</div>
    </section>
    {canUpdate && <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Position skill targets")}</h3>
      <form onSubmit={submitRequirement} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("Position")}<select required className={field} value={requirement.position_id} onChange={(e) => setRequirement({ ...requirement, position_id: e.target.value })}><option value="">—</option>{positions.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.title}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Skill")}<select required className={field} value={requirement.skill_id} onChange={(e) => setRequirement({ ...requirement, skill_id: e.target.value })}><option value="">—</option>{activeSkills.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.name}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Target level")}<input required type="number" min="1" max="10" className={field} value={requirement.target_level} onChange={(e) => setRequirement({ ...requirement, target_level: e.target.value })} /></label>
        <button disabled={busy} className={button}>{t("Save")}</button>
      </form>
      <div className="space-y-1">{positionSkills.map((item) => <p key={idOf(item)}>{positions.find((position) => idOf(position) === idOf(item.position_id))?.title || idOf(item.position_id)} · {skillName(item.skill_id)}: {item.target_level}/10 <button className="ms-2 rounded border px-2 py-1 text-sm" onClick={() => run(() => removePositionSkill(idOf(item)).unwrap(), "Position skill removed")}>{t("Remove")}</button></p>)}</div>
    </section>}
    {canAssess && <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Employee skill assessment")}</h3>
      <form onSubmit={submitAssessment} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("Employee")}<select required className={field} value={assessment.employee_id} onChange={(e) => setAssessment({ ...assessment, employee_id: e.target.value })}><option value="">—</option>{people.map((item) => <option key={idOf(item.user_id)} value={idOf(item.user_id)}>{personName(item.user_id)}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Skill")}<select required className={field} value={assessment.skill_id} onChange={(e) => setAssessment({ ...assessment, skill_id: e.target.value })}><option value="">—</option>{activeSkills.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.name}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Current level")}<input required type="number" min="0" max="10" className={field} value={assessment.current_level} onChange={(e) => setAssessment({ ...assessment, current_level: e.target.value })} /></label>
        <label className="flex flex-col gap-1">{t("Personal target level")}<input type="number" min="1" max="10" className={field} value={assessment.target_level} onChange={(e) => setAssessment({ ...assessment, target_level: e.target.value })} /></label>
        <button disabled={busy} className={button}>{t("Save")}</button>
      </form>
    </section>}
    <section className="space-y-2"><h3 className="text-lg font-semibold">{t("Assessed skills")}</h3>
      <div className="flex flex-wrap gap-2">{employeeSkills.map((item) => <div key={idOf(item)} className="rounded-lg border p-2 text-sm">
        {canList && <strong className="me-2">{personName(item.employee_id)}</strong>}{skillName(item.skill_id)}: {item.current_level}/10
        {item.target_level && <span className="ms-2">{t("Target level")}: {item.target_level}/10</span>}
      </div>)}</div>
    </section>
    <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Learning courses")}</h3>
      {canCreate && <form onSubmit={submitCourse} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("Course title")}<input required maxLength={160} className={field} value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} /></label>
        <label className="flex flex-col gap-1">{t("Description")}<input maxLength={2000} className={field} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} /></label>
        <fieldset className="max-h-36 overflow-y-auto rounded-lg border p-2"><legend>{t("Skills covered")}</legend>{activeSkills.map((item) => <label key={idOf(item)} className="me-3 whitespace-nowrap"><input type="checkbox" checked={course.skill_ids.includes(idOf(item))} onChange={(e) => setCourse({ ...course, skill_ids: e.target.checked ? [...course.skill_ids, idOf(item)] : course.skill_ids.filter((id) => id !== idOf(item)) })} /> {item.name}</label>)}</fieldset>
        <div className="space-y-2">{course.materials.map((material, index) => <div key={index} className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1">{t("Material title")}<input required maxLength={160} className={field} value={material.title} onChange={(e) => setCourse({ ...course, materials: course.materials.map((entry, i) => i === index ? { ...entry, title: e.target.value } : entry) })} /></label>
          <label className="flex flex-col gap-1">{t("Material URL")}<input required type="url" maxLength={1000} className={field} value={material.url} onChange={(e) => setCourse({ ...course, materials: course.materials.map((entry, i) => i === index ? { ...entry, url: e.target.value } : entry) })} /></label>
          <button type="button" className="rounded border px-2 py-1" onClick={() => setCourse({ ...course, materials: course.materials.filter((_, i) => i !== index) })}>{t("Remove")}</button>
        </div>)}<button type="button" className="rounded border px-3 py-2" disabled={course.materials.length >= 30} onClick={() => setCourse({ ...course, materials: [...course.materials, { title: "", url: "" }] })}>{t("Add material")}</button></div>
        <button disabled={busy} className={button}>{t("Create course")}</button>
      </form>}
      <div className="grid gap-3 md:grid-cols-2">{courses.map((item) => <div key={idOf(item)} className="rounded-lg border p-3">
        <strong>{item.title}</strong>{!item.active && <span className="ms-2">{t("Inactive")}</span>}
        <p className="text-sm opacity-70">{item.description}</p>
        <p className="text-sm">{item.skill_ids?.map(skillName).join("، ")}</p>
        {item.materials?.map((material) => <a key={material.url} className="me-3 text-primary-500 underline" href={material.url} target="_blank" rel="noopener noreferrer">{material.title}</a>)}
        {canUpdate && <button className="ms-2 rounded border px-2 py-1 text-sm" onClick={() => run(() => setCourseActive({ id: idOf(item), active: !item.active }).unwrap(), "Course updated")}>{item.active ? t("Deactivate") : t("Activate")}</button>}
      </div>)}</div>
    </section>
    {canAssign && <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Enroll employee")}</h3>
      <form onSubmit={submitEnrollment} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">{t("Employee")}<select required className={field} value={enrollment.employee_id} onChange={(e) => setEnrollment({ ...enrollment, employee_id: e.target.value, development_plan_id: "", development_action_id: "" })}><option value="">—</option>{people.map((item) => <option key={idOf(item.user_id)} value={idOf(item.user_id)}>{personName(item.user_id)}</option>)}</select></label>
        <label className="flex flex-col gap-1">{t("Course")}<select required className={field} value={enrollment.course_id} onChange={(e) => setEnrollment({ ...enrollment, course_id: e.target.value })}><option value="">—</option>{activeCourses.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.title}</option>)}</select></label>
        {canListPlans && <label className="flex flex-col gap-1">{t("Development plan")}<select className={field} value={enrollment.development_plan_id} onChange={(e) => setEnrollment({ ...enrollment, development_plan_id: e.target.value, development_action_id: "" })}><option value="">—</option>{selectedPlans.map((plan) => <option key={idOf(plan)} value={idOf(plan)}>{plan.title}</option>)}</select></label>}
        {selectedPlan?.status === "ACTIVE" && <label className="flex flex-col gap-1">{t("Development action")}<select className={field} value={enrollment.development_action_id} onChange={(e) => setEnrollment({ ...enrollment, development_action_id: e.target.value })}><option value="">—</option>{selectedPlan.actions?.filter((action) => ["TRAINING", "CERTIFICATION", "SELF_STUDY"].includes(action.type)).map((action) => <option key={idOf(action)} value={idOf(action)}>{action.title}</option>)}</select></label>}
        <button disabled={busy} className={button}>{t("Enroll")}</button>
      </form>
    </section>}
    <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Learning records")}</h3>
      <div className="space-y-2">{enrollments.map((item) => <div key={idOf(item)} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
        {canList && <strong>{personName(item.employee_id)}</strong>}<span>{courseName(item.course_id)}</span><span>{t(item.status)}</span>
        {item.result_score !== null && item.result_score !== undefined && <span>{t("Result")}: {item.result_score}%</span>}
        {item.certificate_url && <a href={item.certificate_url} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">{t("Certificate")}</a>}
        {item.development_plan_id && <span className="text-sm opacity-70">{t("Linked to development plan")}</span>}
        {canAssess && item.status === "ENROLLED" && <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-sm">{t("Result")}<input className={field} type="number" min="0" max="100" value={completionDrafts[idOf(item)]?.result_score ?? ""} onChange={(e) => setCompletionDrafts({ ...completionDrafts, [idOf(item)]: { ...completionDrafts[idOf(item)], result_score: e.target.value } })} /></label>
          <label className="flex flex-col gap-1 text-sm">{t("Certificate URL")}<input className={field} type="url" value={completionDrafts[idOf(item)]?.certificate_url ?? ""} onChange={(e) => setCompletionDrafts({ ...completionDrafts, [idOf(item)]: { ...completionDrafts[idOf(item)], certificate_url: e.target.value } })} /></label>
          <button disabled={busy} className={button} onClick={() => run(() => completeEnrollment({ id: idOf(item), body: {
            ...(completionDrafts[idOf(item)]?.result_score !== "" && completionDrafts[idOf(item)]?.result_score !== undefined ? { result_score: Number(completionDrafts[idOf(item)].result_score) } : {}),
            ...(completionDrafts[idOf(item)]?.certificate_url ? { certificate_url: completionDrafts[idOf(item)].certificate_url } : {}),
          } }).unwrap(), "Course completed")}>{t("Complete")}</button>
        </div>}
      </div>)}</div>
    </section>
    <section className="space-y-3"><h3 className="text-lg font-semibold">{t("Skill gaps")}</h3>
      {report && <div className="flex flex-wrap gap-3 text-sm"><span>{t("Skills reviewed")}: {report.organization.skills}</span><span>{t("Gaps")}: {report.organization.gaps}</span><span>{t("Not assessed")}: {report.organization.unassessed}</span></div>}
      {canList && report?.departments?.length > 0 && <div className="flex flex-wrap gap-2">{report.departments.map((item) => <div key={item.department_id || "none"} className="rounded-lg border p-2">{item.department_name || t("No department")}: {item.gaps} {t("Gaps")}, {item.unassessed} {t("Not assessed")}</div>)}</div>}
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-start"><th className="p-2 text-start">{t("Employee")}</th><th className="p-2 text-start">{t("Department")}</th><th className="p-2 text-start">{t("Skill")}</th><th className="p-2 text-start">{t("Current level")}</th><th className="p-2 text-start">{t("Target level")}</th><th className="p-2 text-start">{t("Gap")}</th></tr></thead>
        <tbody>{report?.rows?.map((row) => <tr key={`${row.employee_id}-${row.skill_id}`} className="border-b"><td className="p-2">{row.employee_name}</td><td className="p-2">{row.department_name || "—"}</td><td className="p-2">{row.skill_name}</td><td className="p-2">{row.current_level ?? t("Not assessed")}</td><td className="p-2">{row.target_level}</td><td className="p-2">{row.gap ?? "—"}</td></tr>)}</tbody></table></div>
    </section>
  </div>;
}
