"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePermission } from "@/Hooks/usePermission";
import { useGetSurveysQuery, useCreateSurveyMutation, useOpenSurveyMutation, useCloseSurveyMutation,
  useSubmitSurveyMutation, useGetSurveyResultsQuery } from "@/redux/employees/surveysApi";

const field = "rounded-lg border border-gray-300 bg-surface px-3 py-2 text-cell-primary dark:border-gray-700";
const button = "rounded-lg bg-primary-500 px-4 py-2 text-white disabled:opacity-50";
const errorMessage = (error) => { const value = error?.data?.message || error?.message; return Array.isArray(value) ? value.join("، ") : value || "Operation failed"; };
const newQuestion = () => ({ title: "", type: "RATING", options: "", required: true });

function Results({ id }) {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetSurveyResultsQuery(id);
  if (isLoading) return <p>{t("Loading")}</p>;
  if (error) return <p role="alert">{t(errorMessage(error))}</p>;
  return <div className="space-y-3 rounded-lg border border-status-border p-4">
    <p className="font-semibold">{t("Responses")}: {data?.response_count ?? 0}</p>
    {data?.questions?.map((question) => <div key={question.question_id} className="border-t border-status-border pt-2">
      <p className="font-medium">{question.title} · {t("Answers")}: {question.answer_count}</p>
      {question.counts && <div className="flex flex-wrap gap-3">{Object.entries(question.counts).map(([value, count]) =>
        <span key={value}>{value}: {count}</span>)}</div>}
      {question.text_answers?.length > 0 && <ul className="list-disc ps-6">{question.text_answers.map((value, index) => <li key={index}>{value}</li>)}</ul>}
    </div>)}
  </div>;
}

export default function SurveysPanel() {
  const { t } = useTranslation();
  const canList = usePermission("surveys.list");
  const canCreate = usePermission("surveys.create");
  const canUpdate = usePermission("surveys.update");
  const [draft, setDraft] = useState({ title: "", description: "", closes_at: "", questions: [newQuestion()] });
  const [answers, setAnswers] = useState({});
  const [resultsId, setResultsId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const { data: surveys = [], isLoading, error } = useGetSurveysQuery();
  const [create] = useCreateSurveyMutation();
  const [open] = useOpenSurveyMutation();
  const [close] = useCloseSurveyMutation();
  const [submit] = useSubmitSurveyMutation();
  const run = async (action, success) => { setBusy(true); setFeedback(""); try { await action(); setFeedback(t(success)); }
    catch (err) { setFeedback(t(errorMessage(err))); } finally { setBusy(false); } };
  const updateQuestion = (index, patch) => setDraft(current => ({ ...current, questions: current.questions.map((question, i) => i === index ? { ...question, ...patch } : question) }));
  const createSurvey = (event) => { event.preventDefault(); run(async () => {
    await create({ title: draft.title, description: draft.description,
      ...(draft.closes_at ? { closes_at: new Date(draft.closes_at).toISOString() } : {}),
      questions: draft.questions.map(question => ({ ...question,
        options: question.type === "CHOICE" ? question.options.split("\n").map(value => value.trim()).filter(Boolean) : [] })) }).unwrap();
    setDraft({ title: "", description: "", closes_at: "", questions: [newQuestion()] });
  }, "Survey saved"); };
  return <div className="space-y-6 text-cell-primary">
    {feedback && <p role="status" className="rounded-lg bg-status-bg p-3">{feedback}</p>}
    {canCreate && <form onSubmit={createSurvey} className="space-y-3 rounded-xl border border-status-border p-4">
      <h3 className="font-semibold">{t("Create survey")}</h3>
      <input required maxLength={160} className={field} placeholder={t("Survey title")} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
      <textarea maxLength={1000} className={`${field} w-full`} placeholder={t("Description")} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
      <label className="flex flex-col gap-1">{t("Closing date")}<input type="datetime-local" className={field} value={draft.closes_at} onChange={e => setDraft({ ...draft, closes_at: e.target.value })} /></label>
      {draft.questions.map((question, index) => <div key={index} className="space-y-2 rounded-lg border border-status-border p-3">
        <input required maxLength={300} className={`${field} w-full`} placeholder={t("Question")} value={question.title} onChange={e => updateQuestion(index, { title: e.target.value })} />
        <select className={field} value={question.type} onChange={e => updateQuestion(index, { type: e.target.value, options: "" })}>
          {["RATING", "CHOICE", "TEXT"].map(type => <option key={type} value={type}>{t(type)}</option>)}
        </select>
        {question.type === "CHOICE" && <textarea required className={`${field} w-full`} placeholder={t("One option per line")} value={question.options} onChange={e => updateQuestion(index, { options: e.target.value })} />}
        <label className="ms-3"><input type="checkbox" checked={question.required} onChange={e => updateQuestion(index, { required: e.target.checked })} /> {t("Required")}</label>
        {draft.questions.length > 1 && <button type="button" onClick={() => setDraft({ ...draft, questions: draft.questions.filter((_, i) => i !== index) })}>{t("Remove question")}</button>}
      </div>)}
      <div className="flex gap-2"><button type="button" className={field} onClick={() => setDraft({ ...draft, questions: [...draft.questions, newQuestion()] })}>{t("Add question")}</button>
        <button disabled={busy} className={button}>{t("Save draft")}</button></div>
    </form>}
    {isLoading && <p>{t("Loading")}</p>}{error && <p role="alert">{t(errorMessage(error))}</p>}
    {surveys.map(survey => <div key={survey._id} className="space-y-3 rounded-xl border border-status-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-semibold">{survey.title}</h3><p>{survey.description}</p><p>{t(survey.status)}{survey.closes_at && ` · ${new Date(survey.closes_at).toLocaleString()}`}</p></div>
        <div className="flex gap-2">{canUpdate && survey.status === "DRAFT" && <button disabled={busy} className={button} onClick={() => run(() => open(survey._id).unwrap(), "Survey opened")}>{t("Open survey")}</button>}
          {canUpdate && survey.status === "OPEN" && <button disabled={busy} className={field} onClick={() => run(() => close(survey._id).unwrap(), "Survey closed")}>{t("Close survey")}</button>}
          {canList && <button className={field} onClick={() => setResultsId(resultsId === survey._id ? "" : survey._id)}>{t("Results")}</button>}
        </div></div>
      {resultsId === survey._id && canList && <Results id={survey._id} />}
      {!canList && !survey.responded && !survey.expired && <form onSubmit={event => { event.preventDefault(); run(async () => {
        await submit({ id: survey._id, body: { answers: survey.questions.filter(question => String(answers[`${survey._id}:${question._id}`] ?? "").trim())
          .map(question => ({ question_id: question._id, value: String(answers[`${survey._id}:${question._id}`]) })) } }).unwrap();
      }, "Response submitted"); }} className="space-y-3">
        {survey.questions.map(question => <label key={question._id} className="flex flex-col gap-1">{question.title}{question.required && " *"}
          {question.type === "TEXT" ? <textarea required={question.required} maxLength={2000} className={field} value={answers[`${survey._id}:${question._id}`] || ""} onChange={e => setAnswers({ ...answers, [`${survey._id}:${question._id}`]: e.target.value })} />
            : <select required={question.required} className={field} value={answers[`${survey._id}:${question._id}`] || ""} onChange={e => setAnswers({ ...answers, [`${survey._id}:${question._id}`]: e.target.value })}>
              <option value="">{t("Select")}</option>{(question.type === "RATING" ? ["1", "2", "3", "4", "5"] : question.options).map(option => <option key={option} value={option}>{option}</option>)}
            </select>}
        </label>)}<button disabled={busy} className={button}>{t("Submit response")}</button>
      </form>}
      {!canList && survey.responded && <p>{t("Already responded")}</p>}
      {!canList && survey.expired && <p>{t("Survey expired")}</p>}
    </div>)}
  </div>;
}
