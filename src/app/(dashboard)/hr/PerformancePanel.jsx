"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserId, selectUserType } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
  useGetPerformanceCyclesQuery, useCreatePerformanceCycleMutation,
  useActivatePerformanceCycleMutation, useClosePerformanceCycleMutation,
  useAssignPerformanceReviewsMutation, useGetPerformanceReviewsQuery,
  useAddPerformanceGoalMutation, useUpdatePerformanceGoalMutation,
  useSubmitSelfAssessmentMutation, useSubmitManagerAssessmentMutation,
  useFinalizePerformanceReviewMutation,
} from "@/redux/employees/performanceApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const idOf = (value) => String(value?._id || value || "");
const dateValue = (value) => value ? new Date(value).toLocaleDateString() : "—";
const messageOf = (error) => {
  const message = error?.data?.message || error?.message;
  return Array.isArray(message) ? message.join("، ") : message || "Operation failed";
};

export default function PerformancePanel() {
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);
  const userType = useSelector(selectUserType);
  const canManage = usePermission("performance.manage_settings");
  const canAssign = usePermission("performance.assign");
  const canUpdate = usePermission("performance.update");
  const canEvaluate = usePermission("performance.evaluate");
  const canListEmployees = usePermission("employee_details.list");
  const { data: cycles = [], isLoading: loadingCycles, error: cyclesError } = useGetPerformanceCyclesQuery();
  const { data: reviews = [], isLoading: loadingReviews, error: reviewsError } = useGetPerformanceReviewsQuery();
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canListEmployees });
  const [createCycle] = useCreatePerformanceCycleMutation();
  const [activateCycle] = useActivatePerformanceCycleMutation();
  const [closeCycle] = useClosePerformanceCycleMutation();
  const [assignReviews] = useAssignPerformanceReviewsMutation();
  const [addGoal] = useAddPerformanceGoalMutation();
  const [updateGoal] = useUpdatePerformanceGoalMutation();
  const [submitSelf] = useSubmitSelfAssessmentMutation();
  const [submitManager] = useSubmitManagerAssessmentMutation();
  const [finalizeReview] = useFinalizePerformanceReviewMutation();
  const [cycleForm, setCycleForm] = useState({ name: "", starts_at: "", ends_at: "", rating_scale: 5, goals_weight: 70, competencies_weight: 30 });
  const [assignment, setAssignment] = useState({ cycleId: "", employeeId: "" });
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const people = employees.filter((employee) => employee.registration_status !== "pending" && employee.user_id);
  const personName = (id) => people.find((employee) => idOf(employee.user_id) === idOf(id))?.user?.name || idOf(id);
  const shownReviews = userType === "Subscriber" || canManage || canAssign
    ? reviews
    : reviews.filter((review) => idOf(review.employee_id) === idOf(userId) || idOf(review.manager_id) === idOf(userId));
  const cycleFor = (review) => cycles.find((cycle) => idOf(cycle._id) === idOf(review.cycle_id));
  const setDraft = (reviewId, patch) => setDrafts((current) => ({ ...current, [reviewId]: { ...current[reviewId], ...patch } }));
  const execute = async (action, success) => {
    setBusy(true);
    setFeedback("");
    try { await action(); setFeedback(t(success)); }
    catch (error) { setFeedback(messageOf(error)); }
    finally { setBusy(false); }
  };

  const submitCycle = (event) => {
    event.preventDefault();
    if (Number(cycleForm.goals_weight) + Number(cycleForm.competencies_weight) !== 100) {
      setFeedback(t("Weights must total 100")); return;
    }
    execute(async () => {
      await createCycle({ ...cycleForm, rating_scale: Number(cycleForm.rating_scale), goals_weight: Number(cycleForm.goals_weight), competencies_weight: Number(cycleForm.competencies_weight), starts_at: `${cycleForm.starts_at}T00:00:00.000Z`, ends_at: `${cycleForm.ends_at}T00:00:00.000Z` }).unwrap();
      setCycleForm({ name: "", starts_at: "", ends_at: "", rating_scale: 5, goals_weight: 70, competencies_weight: 30 });
    }, "Performance cycle created");
  };

  const submitAssignment = (event) => {
    event.preventDefault();
    execute(() => assignReviews({ cycleId: assignment.cycleId, employee_ids: [assignment.employeeId] }).unwrap(), "Review assigned");
  };

  if (loadingCycles || loadingReviews) return <p>{t("Loading...")}</p>;
  if (cyclesError || reviewsError) return <p role="alert" className="text-red-600">{messageOf(cyclesError || reviewsError)}</p>;

  return <div className="space-y-6" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}
    {canManage && <form onSubmit={submitCycle} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-cell-primary">{t("Create performance cycle")}</h2>
      <div className="flex flex-wrap gap-3">
        <input className={field} required minLength={2} maxLength={120} value={cycleForm.name} onChange={(event) => setCycleForm({ ...cycleForm, name: event.target.value })} placeholder={t("Cycle name")} aria-label={t("Cycle name")} />
        <label className="text-sm text-cell-primary">{t("Start date")} <input className={field} required type="date" value={cycleForm.starts_at} onChange={(event) => setCycleForm({ ...cycleForm, starts_at: event.target.value })} /></label>
        <label className="text-sm text-cell-primary">{t("End date")} <input className={field} required type="date" min={cycleForm.starts_at || undefined} value={cycleForm.ends_at} onChange={(event) => setCycleForm({ ...cycleForm, ends_at: event.target.value })} /></label>
        <label className="text-sm text-cell-primary">{t("Rating scale")} <input className={`${field} w-20`} type="number" min={1} max={10} value={cycleForm.rating_scale} onChange={(event) => setCycleForm({ ...cycleForm, rating_scale: event.target.value })} /></label>
        <label className="text-sm text-cell-primary">{t("Goals weight")} <input className={`${field} w-20`} type="number" min={0} max={100} value={cycleForm.goals_weight} onChange={(event) => setCycleForm({ ...cycleForm, goals_weight: event.target.value, competencies_weight: 100 - Number(event.target.value) })} /></label>
        <label className="text-sm text-cell-primary">{t("Competencies weight")} <input className={`${field} w-20`} type="number" min={0} max={100} value={cycleForm.competencies_weight} onChange={(event) => setCycleForm({ ...cycleForm, competencies_weight: event.target.value, goals_weight: 100 - Number(event.target.value) })} /></label>
      </div>
      <button className={button} disabled={busy}>{t("Create cycle")}</button>
    </form>}

    <section className="space-y-3"><h2 className="text-lg font-semibold text-cell-primary">{t("Performance cycles")}</h2>
      {!cycles.length && <p className="text-cell-secondary">{t("No performance cycles yet")}</p>}
      {cycles.map((cycle) => <div key={cycle._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <div><strong className="text-cell-primary">{cycle.name}</strong><p className="text-sm text-cell-secondary">{dateValue(cycle.starts_at)} – {dateValue(cycle.ends_at)} · {t(cycle.status)} · {t("Scale")}: {cycle.rating_scale}</p></div>
        {canManage && cycle.status === "DRAFT" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => activateCycle(cycle._id).unwrap(), "Cycle activated")}>{t("Activate")}</button>}
        {canManage && cycle.status === "ACTIVE" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => closeCycle(cycle._id).unwrap(), "Cycle closed")}>{t("Close cycle")}</button>}
      </div>)}
    </section>

    {canAssign && canListEmployees && <form onSubmit={submitAssignment} className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="w-full text-lg font-semibold text-cell-primary">{t("Assign employee review")}</h2>
      <label className="flex flex-col gap-1 text-sm text-cell-primary">{t("Cycle")}<select className={field} required value={assignment.cycleId} onChange={(event) => setAssignment({ ...assignment, cycleId: event.target.value })}><option value="">{t("Select cycle")}</option>{cycles.filter((cycle) => cycle.status !== "CLOSED").map((cycle) => <option key={cycle._id} value={cycle._id}>{cycle.name}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm text-cell-primary">{t("Employee")}<select className={field} required value={assignment.employeeId} onChange={(event) => setAssignment({ ...assignment, employeeId: event.target.value })}><option value="">{t("Select employee")}</option>{people.map((employee) => <option key={employee._id} value={employee.user_id}>{employee.user?.name || employee.user?.email}</option>)}</select></label>
      <button className={button} disabled={busy}>{t("Assign review")}</button>
    </form>}

    <section className="space-y-4"><h2 className="text-lg font-semibold text-cell-primary">{t("Employee reviews")}</h2>
      {!shownReviews.length && <p className="text-cell-secondary">{t("No reviews yet")}</p>}
      {shownReviews.map((review) => {
        const cycle = cycleFor(review);
        const draft = drafts[review._id] || {};
        const isSelf = idOf(review.employee_id) === idOf(userId);
        const isManager = idOf(review.manager_id) === idOf(userId);
        const open = review.status !== "FINALIZED" && cycle?.status === "ACTIVE";
        const goalWeight = review.goals?.filter((goal) => goal.status !== "CANCELLED").reduce((sum, goal) => sum + goal.weight, 0) || 0;
        return <article key={review._id} className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-cell-primary">{personName(review.employee_id)} · {cycle?.name || ""}</h3><span className="text-sm text-cell-secondary">{t(review.status)}{review.final_rating != null ? ` · ${t("Final rating")}: ${review.final_rating}/${cycle?.rating_scale || 5}` : ""}</span></div>
          <div className="space-y-2"><p className="text-sm text-cell-secondary">{t("Goal weights")}: {goalWeight}/100</p>
            {review.goals?.map((goal) => <div key={goal._id} className="flex flex-wrap items-center gap-3 rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
              <span className="min-w-40">{goal.title} · {goal.weight}%</span><span>{goal.progress}% · {t(goal.status)}</span>
              {open && canUpdate && (isSelf || isManager) && goal.status !== "CANCELLED" && <><input className={`${field} w-20`} aria-label={`${goal.title} ${t("Progress")}`} type="number" min={0} max={100} value={draft[`progress-${goal._id}`] ?? goal.progress} onChange={(event) => setDraft(review._id, { [`progress-${goal._id}`]: event.target.value })} /><button type="button" className={button} disabled={busy} onClick={() => execute(() => updateGoal({ reviewId: review._id, goalId: goal._id, body: { progress: Number(draft[`progress-${goal._id}`] ?? goal.progress) } }).unwrap(), "Goal progress saved")}>{t("Save progress")}</button></>}
            </div>)}
          </div>
          {open && canUpdate && <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); execute(() => addGoal({ reviewId: review._id, body: { title: draft.goalTitle, weight: Number(draft.goalWeight) } }).unwrap(), "Goal added"); }}>
            <input className={field} required minLength={2} maxLength={160} placeholder={t("New goal")} aria-label={t("New goal")} value={draft.goalTitle || ""} onChange={(event) => setDraft(review._id, { goalTitle: event.target.value })} />
            <input className={`${field} w-24`} required type="number" min={1} max={100 - goalWeight} placeholder={t("Weight")} aria-label={t("Weight")} value={draft.goalWeight || ""} onChange={(event) => setDraft(review._id, { goalWeight: event.target.value })} />
            <button className={button} disabled={busy || goalWeight >= 100}>{t("Add goal")}</button>
          </form>}
          {open && canEvaluate && isSelf && review.status === "ACTIVE" && <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); execute(() => submitSelf({ reviewId: review._id, body: { rating: Number(draft.selfRating), comment: draft.selfComment || "" } }).unwrap(), "Self assessment submitted"); }}>
            <input className={`${field} w-28`} type="number" required min={0} max={cycle.rating_scale} step="0.1" placeholder={t("Self rating")} aria-label={t("Self rating")} value={draft.selfRating || ""} onChange={(event) => setDraft(review._id, { selfRating: event.target.value })} />
            <input className={field} maxLength={2000} placeholder={t("Self comment")} aria-label={t("Self comment")} value={draft.selfComment || ""} onChange={(event) => setDraft(review._id, { selfComment: event.target.value })} />
            <button className={button} disabled={busy}>{t("Submit self assessment")}</button>
          </form>}
          {open && canEvaluate && isManager && review.status === "SELF_SUBMITTED" && <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); execute(() => submitManager({ reviewId: review._id, body: { competency_rating: Number(draft.managerRating), comment: draft.managerComment || "" } }).unwrap(), "Manager assessment submitted"); }}>
            <input className={`${field} w-28`} type="number" required min={0} max={cycle.rating_scale} step="0.1" placeholder={t("Competency rating")} aria-label={t("Competency rating")} value={draft.managerRating || ""} onChange={(event) => setDraft(review._id, { managerRating: event.target.value })} />
            <input className={field} maxLength={2000} placeholder={t("Manager comment")} aria-label={t("Manager comment")} value={draft.managerComment || ""} onChange={(event) => setDraft(review._id, { managerComment: event.target.value })} />
            <button className={button} disabled={busy}>{t("Submit manager assessment")}</button>
          </form>}
          {open && canEvaluate && review.status === "MANAGER_SUBMITTED" && goalWeight === 100 && (canManage || userType === "Subscriber") && <button type="button" className={button} disabled={busy} onClick={() => execute(() => finalizeReview(review._id).unwrap(), "Review finalized")}>{t("Finalize review")}</button>}
        </article>;
      })}
    </section>
  </div>;
}
