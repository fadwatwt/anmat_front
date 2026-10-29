"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUserId } from "@/redux/auth/authSlice";
import { usePermission } from "@/Hooks/usePermission";
import { useGetLifecycleTemplatesQuery } from "@/redux/employees/lifecycleApi";
import { useGetEmployeesQuery } from "@/redux/employees/employeesApi";
import {
  useGetRecruitmentJobsQuery, useCreateRecruitmentJobMutation, useSetRecruitmentJobStatusMutation,
  useGetRecruitmentCandidatesQuery, useCreateRecruitmentCandidateMutation,
  useGetCandidateFilesQuery, useUploadCandidateFileMutation,
  useGetRecruitmentApplicationsQuery, useCreateRecruitmentApplicationMutation,
  useMoveRecruitmentStageMutation, useSetRecruitmentApplicationStatusMutation,
  useScheduleRecruitmentInterviewMutation, useEvaluateRecruitmentInterviewMutation,
  useCreateRecruitmentOfferMutation, useSetRecruitmentOfferStatusMutation,
  useConvertRecruitmentApplicationMutation, useGetRecruitmentReportQuery,
} from "@/redux/employees/recruitmentApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const idOf = (value) => String(value?._id || value || "");
const dateOf = (value) => value ? new Date(value).toLocaleDateString() : "—";
const errorOf = (error) => {
  const value = error?.data?.message || error?.message;
  return Array.isArray(value) ? value.join("، ") : value || "Operation failed";
};

export default function RecruitmentPanel() {
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);
  const canCreate = usePermission("recruitment.create");
  const canUpdate = usePermission("recruitment.update");
  const canApprove = usePermission("recruitment.approve");
  const canEvaluate = usePermission("recruitment.evaluate");
  const canUpload = usePermission("recruitment.upload");
  const canView = usePermission("recruitment.view");
  const canListEmployees = usePermission("employee_details.list");
  const canViewTemplates = usePermission("employee_lifecycle.list");
  const { data: jobs = [], isLoading: loadingJobs, error: jobsError } = useGetRecruitmentJobsQuery();
  const { data: candidates = [], error: candidatesError } = useGetRecruitmentCandidatesQuery();
  const { data: applications = [], error: applicationsError } = useGetRecruitmentApplicationsQuery();
  const { data: report } = useGetRecruitmentReportQuery();
  const { data: templates = [] } = useGetLifecycleTemplatesQuery(undefined, { skip: !canViewTemplates });
  const { data: employees = [] } = useGetEmployeesQuery(undefined, { skip: !canListEmployees });
  const [createJob] = useCreateRecruitmentJobMutation();
  const [setJobStatus] = useSetRecruitmentJobStatusMutation();
  const [createCandidate] = useCreateRecruitmentCandidateMutation();
  const [createApplication] = useCreateRecruitmentApplicationMutation();
  const [moveStage] = useMoveRecruitmentStageMutation();
  const [setApplicationStatus] = useSetRecruitmentApplicationStatusMutation();
  const [scheduleInterview] = useScheduleRecruitmentInterviewMutation();
  const [evaluateInterview] = useEvaluateRecruitmentInterviewMutation();
  const [createOffer] = useCreateRecruitmentOfferMutation();
  const [setOfferStatus] = useSetRecruitmentOfferStatusMutation();
  const [convertApplication] = useConvertRecruitmentApplicationMutation();
  const [uploadFile] = useUploadCandidateFileMutation();
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const { data: files = [] } = useGetCandidateFilesQuery(selectedCandidateId, { skip: !selectedCandidateId || !canView });
  const [jobForm, setJobForm] = useState({ title: "", description: "", stages: "Screening, Interview, Offer", onboarding_template_id: "" });
  const [candidateForm, setCandidateForm] = useState({ name: "", email: "", phone: "", source: "" });
  const [applicationForm, setApplicationForm] = useState({ job_id: "", candidate_id: "", source: "" });
  const [interviewForm, setInterviewForm] = useState({});
  const [offerForm, setOfferForm] = useState({});
  const [evaluationForm, setEvaluationForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const people = employees.filter((person) => person.registration_status !== "pending" && person.user_id);
  const nameOf = (candidateId) => candidates.find((candidate) => idOf(candidate._id) === idOf(candidateId))?.name || idOf(candidateId);
  const jobOf = (jobId) => jobs.find((job) => idOf(job._id) === idOf(jobId));
  const execute = async (action, success) => {
    setBusy(true); setFeedback("");
    try { await action(); setFeedback(t(success)); }
    catch (error) { setFeedback(errorOf(error)); }
    finally { setBusy(false); }
  };

  const submitJob = (event) => {
    event.preventDefault();
    const stages = jobForm.stages.split(",").map((stage) => stage.trim()).filter(Boolean);
    if (stages.length < 2 || new Set(stages).size !== stages.length) { setFeedback(t("Enter at least two unique stages")); return; }
    const template = templates.find((entry) => entry._id === jobForm.onboarding_template_id);
    execute(async () => {
      await createJob({ ...jobForm, stages,
        ...(template?.department_id ? { department_id: idOf(template.department_id) } : {}),
        ...(template?.position_id ? { position_id: idOf(template.position_id) } : {}),
      }).unwrap();
      setJobForm({ title: "", description: "", stages: "Screening, Interview, Offer", onboarding_template_id: "" });
    }, "Recruitment job created");
  };
  const submitCandidate = (event) => {
    event.preventDefault();
    execute(async () => {
      await createCandidate(candidateForm).unwrap();
      setCandidateForm({ name: "", email: "", phone: "", source: "" });
    }, "Candidate saved");
  };
  const submitApplication = (event) => {
    event.preventDefault();
    execute(async () => {
      await createApplication(applicationForm).unwrap();
      setApplicationForm({ job_id: "", candidate_id: "", source: "" });
    }, "Application created");
  };
  const upload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selectedCandidateId) return;
    const body = new FormData(); body.append("file", file); body.append("category", "CV");
    execute(() => uploadFile({ id: selectedCandidateId, body }).unwrap(), "Candidate file uploaded");
  };
  const submitInterview = (event, applicationId) => {
    event.preventDefault();
    const form = interviewForm[applicationId] || {};
    execute(async () => {
      await scheduleInterview({ id: applicationId, body: {
        scheduled_at: new Date(form.scheduled_at).toISOString(), interviewer_ids: [form.interviewer_id],
        location: form.location || undefined,
      } }).unwrap();
      setInterviewForm((current) => ({ ...current, [applicationId]: {} }));
    }, "Interview scheduled");
  };
  const submitOffer = (event, applicationId) => {
    event.preventDefault();
    const form = offerForm[applicationId] || {};
    execute(async () => {
      await createOffer({ id: applicationId, body: {
        proposed_start_at: `${form.proposed_start_at}T00:00:00.000Z`, terms: form.terms || undefined,
      } }).unwrap();
      setOfferForm((current) => ({ ...current, [applicationId]: {} }));
    }, "Offer created");
  };

  if (loadingJobs) return <p>{t("Loading...")}</p>;
  const error = jobsError || candidatesError || applicationsError;
  if (error) return <p role="alert" className="text-red-600">{errorOf(error)}</p>;
  return <div className="space-y-6" dir="auto">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3 text-cell-primary">{feedback}</p>}
    {report && <section className="rounded-xl border border-gray-200 p-4 text-sm text-cell-primary dark:border-gray-700">
      <h2 className="font-semibold">{t("Recruitment report")}</h2>
      <p>{t("Open jobs")}: {report.jobs?.open} · {t("Applications")}: {report.applications} · {t("Average days to hire")}: {report.average_days_to_hire ?? "—"}</p>
      <p>{t("Candidate sources")}: {Object.entries(report.by_source || {}).map(([source, count]) => `${source}: ${count}`).join(" · ") || "—"}</p>
    </section>}

    {canCreate && <div className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={submitJob} className="space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="font-semibold text-cell-primary">{t("Create job opening")}</h2>
        <input className={`${field} w-full`} required minLength={2} maxLength={160} value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} placeholder={t("Job title")} aria-label={t("Job title")} />
        <textarea className={`${field} w-full`} maxLength={4000} value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} placeholder={t("Job description")} aria-label={t("Job description")} />
        <input className={`${field} w-full`} required value={jobForm.stages} onChange={(event) => setJobForm({ ...jobForm, stages: event.target.value })} placeholder={t("Stages separated by commas")} aria-label={t("Stages separated by commas")} />
        <select required className={`${field} w-full`} value={jobForm.onboarding_template_id} onChange={(event) => setJobForm({ ...jobForm, onboarding_template_id: event.target.value })} aria-label={t("Onboarding template")}><option value="">{t("Select onboarding template")}</option>{templates.filter((template) => template.type === "ONBOARDING" && template.is_active).map((template) => <option key={template._id} value={template._id}>{template.name}</option>)}</select>
        {!templates.some((template) => template.type === "ONBOARDING" && template.is_active) && <p className="text-sm text-amber-700">{t("Create an onboarding template before opening a job")}</p>}
        <button className={button} disabled={busy || !jobForm.onboarding_template_id}>{t("Create job")}</button>
      </form>
      <form onSubmit={submitCandidate} className="space-y-2 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="font-semibold text-cell-primary">{t("Add candidate")}</h2>
        <input className={`${field} w-full`} required minLength={2} maxLength={100} value={candidateForm.name} onChange={(event) => setCandidateForm({ ...candidateForm, name: event.target.value })} placeholder={t("Candidate name")} aria-label={t("Candidate name")} />
        <input className={`${field} w-full`} required type="email" value={candidateForm.email} onChange={(event) => setCandidateForm({ ...candidateForm, email: event.target.value })} placeholder={t("Email")} aria-label={t("Email")} />
        <input className={`${field} w-full`} value={candidateForm.phone} onChange={(event) => setCandidateForm({ ...candidateForm, phone: event.target.value })} placeholder={t("Phone")} aria-label={t("Phone")} />
        <input className={`${field} w-full`} maxLength={120} value={candidateForm.source} onChange={(event) => setCandidateForm({ ...candidateForm, source: event.target.value })} placeholder={t("Candidate source")} aria-label={t("Candidate source")} />
        <button className={button} disabled={busy}>{t("Save candidate")}</button>
      </form>
    </div>}

    <section className="space-y-2"><h2 className="font-semibold text-cell-primary">{t("Job openings")}</h2>
      {jobs.map((job) => <div key={job._id} className="flex flex-wrap items-center gap-2 rounded-lg bg-status-bg p-3 text-sm text-cell-primary"><strong>{job.title}</strong> · {t(job.status)} · {job.stages.join(" → ")}
        {canUpdate && job.status !== "CLOSED" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => setJobStatus({ id: job._id, status: job.status === "DRAFT" ? "OPEN" : "CLOSED" }).unwrap(), "Job status updated")}>{t(job.status === "DRAFT" ? "Open job" : "Close job")}</button>}
      </div>)}
    </section>

    <section className="space-y-2"><h2 className="font-semibold text-cell-primary">{t("Candidates and CVs")}</h2>
      <div className="flex flex-wrap gap-2">{candidates.map((candidate) => <button key={candidate._id} type="button" className={`${field} ${selectedCandidateId === candidate._id ? "border-primary-500" : ""}`} onClick={() => setSelectedCandidateId(candidate._id)}>{candidate.name} · {candidate.email}</button>)}</div>
      {selectedCandidateId && <div className="rounded-lg bg-status-bg p-3 text-sm text-cell-primary">
        {canUpload && <label className="cursor-pointer text-primary-500">{t("Upload CV")} <input type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={upload} /></label>}
        {canView && <div className="flex flex-wrap gap-2">{files.map((file) => <a key={file._id} href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary-500 underline">{file.name}</a>)}</div>}
      </div>}
    </section>

    {canCreate && <form onSubmit={submitApplication} className="flex flex-wrap gap-2 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <h2 className="w-full font-semibold text-cell-primary">{t("New application")}</h2>
      <select required className={field} value={applicationForm.job_id} onChange={(event) => setApplicationForm({ ...applicationForm, job_id: event.target.value })} aria-label={t("Job")}><option value="">{t("Select job")}</option>{jobs.filter((job) => job.status === "OPEN").map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}</select>
      <select required className={field} value={applicationForm.candidate_id} onChange={(event) => setApplicationForm({ ...applicationForm, candidate_id: event.target.value })} aria-label={t("Candidate")}><option value="">{t("Select candidate")}</option>{candidates.filter((candidate) => !candidate.converted_user_id).map((candidate) => <option key={candidate._id} value={candidate._id}>{candidate.name}</option>)}</select>
      <input className={field} maxLength={120} value={applicationForm.source} onChange={(event) => setApplicationForm({ ...applicationForm, source: event.target.value })} placeholder={t("Candidate source")} aria-label={t("Candidate source")} />
      <button className={button} disabled={busy}>{t("Create application")}</button>
    </form>}

    <section className="space-y-3"><h2 className="font-semibold text-cell-primary">{t("Applications")}</h2>
      {applications.map((application) => {
        const job = jobOf(application.job_id);
        const currentInterview = interviewForm[application._id] || {};
        const currentOffer = offerForm[application._id] || {};
        return <article key={application._id} className="space-y-3 rounded-xl border border-gray-200 p-4 text-sm text-cell-primary dark:border-gray-700">
          <div><strong>{nameOf(application.candidate_id)}</strong> · {job?.title || idOf(application.job_id)} · {t(application.status)} · {application.stage}</div>
          {application.status === "ACTIVE" && canUpdate && <div className="flex flex-wrap gap-2">
            <select className={field} value={application.stage} onChange={(event) => execute(() => moveStage({ id: application._id, stage: event.target.value }).unwrap(), "Stage updated")} aria-label={t("Stage")}>{job?.stages?.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select>
            <button type="button" className={field} disabled={busy} onClick={() => execute(() => setApplicationStatus({ id: application._id, status: "REJECTED" }).unwrap(), "Application rejected")}>{t("Reject application")}</button>
            <button type="button" className={field} disabled={busy} onClick={() => execute(() => setApplicationStatus({ id: application._id, status: "WITHDRAWN" }).unwrap(), "Application withdrawn")}>{t("Record withdrawal")}</button>
          </div>}
          {application.status === "ACTIVE" && canUpdate && <form onSubmit={(event) => submitInterview(event, application._id)} className="flex flex-wrap gap-2">
            <input required type="datetime-local" className={field} value={currentInterview.scheduled_at || ""} onChange={(event) => setInterviewForm({ ...interviewForm, [application._id]: { ...currentInterview, scheduled_at: event.target.value } })} aria-label={t("Interview time")} />
            <select required className={field} value={currentInterview.interviewer_id || ""} onChange={(event) => setInterviewForm({ ...interviewForm, [application._id]: { ...currentInterview, interviewer_id: event.target.value } })} aria-label={t("Interviewer")}><option value="">{t("Select interviewer")}</option>{people.map((person) => <option key={person._id} value={person.user_id}>{person.user?.name || person.user?.email}</option>)}</select>
            <input className={field} maxLength={500} value={currentInterview.location || ""} onChange={(event) => setInterviewForm({ ...interviewForm, [application._id]: { ...currentInterview, location: event.target.value } })} placeholder={t("Interview location")} aria-label={t("Interview location")} />
            <button className={button} disabled={busy}>{t("Schedule interview")}</button>
          </form>}
          {application.interviews?.map((interview) => {
            const key = `${application._id}:${interview._id}`;
            const draft = evaluationForm[key] || {};
            const mine = interview.interviewer_ids?.some((id) => idOf(id) === idOf(userId));
            const evaluated = interview.evaluations?.some((entry) => idOf(entry.interviewer_id) === idOf(userId));
            return <div key={interview._id} className="rounded-lg bg-status-bg p-3">
              <p>{t("Interview")}: {new Date(interview.scheduled_at).toLocaleString()} · {interview.location || "—"}</p>
              {interview.evaluations?.map((entry) => <p key={idOf(entry.interviewer_id)}>{t("Score")}: {entry.score}/5 · {entry.notes || "—"}</p>)}
              {mine && !evaluated && canEvaluate && <form className="mt-2 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); execute(() => evaluateInterview({ id: application._id, interviewId: interview._id, body: { score: Number(draft.score), notes: draft.notes } }).unwrap(), "Evaluation saved"); }}>
                <input required type="number" min="1" max="5" className={`${field} w-20`} value={draft.score || ""} onChange={(event) => setEvaluationForm({ ...evaluationForm, [key]: { ...draft, score: event.target.value } })} aria-label={t("Score")} />
                <input className={field} maxLength={2000} value={draft.notes || ""} onChange={(event) => setEvaluationForm({ ...evaluationForm, [key]: { ...draft, notes: event.target.value } })} placeholder={t("Evaluation notes")} aria-label={t("Evaluation notes")} />
                <button className={button} disabled={busy}>{t("Save evaluation")}</button>
              </form>}
            </div>;
          })}
          {application.status === "ACTIVE" && !application.offer && canApprove && <form onSubmit={(event) => submitOffer(event, application._id)} className="flex flex-wrap gap-2">
            <input required type="date" className={field} value={currentOffer.proposed_start_at || ""} onChange={(event) => setOfferForm({ ...offerForm, [application._id]: { ...currentOffer, proposed_start_at: event.target.value } })} aria-label={t("Proposed start date")} />
            <input className={field} maxLength={2000} value={currentOffer.terms || ""} onChange={(event) => setOfferForm({ ...offerForm, [application._id]: { ...currentOffer, terms: event.target.value } })} placeholder={t("Offer terms")} aria-label={t("Offer terms")} />
            <button className={button} disabled={busy}>{t("Create offer")}</button>
          </form>}
          {application.offer && <div className="space-y-2"><p>{t("Offer")}: {t(application.offer.status)} · {dateOf(application.offer.proposed_start_at)}</p>
            {canApprove && application.offer.status === "DRAFT" && <button type="button" className={button} disabled={busy} onClick={() => execute(() => setOfferStatus({ id: application._id, status: "SENT" }).unwrap(), "Offer sent")}>{t("Mark offer sent")}</button>}
            {canApprove && application.offer.status === "SENT" && <div className="flex gap-2"><button type="button" className={button} disabled={busy} onClick={() => execute(() => setOfferStatus({ id: application._id, status: "ACCEPTED" }).unwrap(), "Offer accepted")}>{t("Record acceptance")}</button><button type="button" className={field} disabled={busy} onClick={() => execute(() => setOfferStatus({ id: application._id, status: "REJECTED" }).unwrap(), "Offer rejected")}>{t("Record rejection")}</button></div>}
            {canApprove && application.offer.status === "ACCEPTED" && !application.converted_employee_id && <button type="button" className={button} disabled={busy} onClick={() => execute(() => convertApplication(application._id).unwrap(), "Employee invitation prepared")}>{application.invitation_id ? t("Resend employee invitation") : t("Invite accepted candidate")}</button>}
            {application.converted_employee_id && <p className="text-green-700">{t("Converted to employee")}</p>}
          </div>}
        </article>;
      })}
    </section>
  </div>;
}
