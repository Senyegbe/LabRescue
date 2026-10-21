"use client";

import { useState } from "react";
import { ISSUE_TYPES } from "../lib/types";
import type { IssueType, Urgency } from "../lib/types";
import { reportInputSchema } from "../lib/validation";

export interface ReportDetails {
  issueType: IssueType;
  deviceName: string;
  symptom: string;
  lessonImpact: string;
  urgency: Urgency;
  notes: string;
}

interface ReportFormProps {
  onSubmit: (details: ReportDetails) => void;
  onCancel: () => void;
}

const defaultSymptoms: Record<IssueType, string> = {
  "projector-no-signal": "The projector displays “No Signal”.",
  "computer-wont-start": "The computer does not start.",
  "internet-unavailable": "The internet connection is unavailable.",
};

export function ReportForm({ onSubmit, onCancel }: ReportFormProps) {
  const [issueType, setIssueType] = useState<IssueType>(
    "projector-no-signal",
  );
  const [deviceName, setDeviceName] = useState("Classroom projector");
  const [symptom, setSymptom] = useState(
    defaultSymptoms["projector-no-signal"],
  );
  const [lessonImpact, setLessonImpact] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function changeIssue(value: IssueType) {
    setIssueType(value);
    const issue = ISSUE_TYPES.find((item) => item.id === value);
    const name = issue?.device ?? "Classroom equipment";
    setDeviceName(
      name.toLowerCase().startsWith("classroom ")
        ? name
        : `Classroom ${name.toLowerCase()}`,
    );
    setSymptom(defaultSymptoms[value]);
  }

  function handleIssueChange(value: string) {
    const issue = ISSUE_TYPES.find((item) => item.id === value);
    if (issue) changeIssue(issue.id);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = reportInputSchema.safeParse({
      issueType,
      deviceName,
      symptom,
      lessonImpact,
      urgency,
      notes,
    });
    if (!parsed.success) {
      setError("Check the required fields and try again.");
      return;
    }
    setError("");
    onSubmit(parsed.data);
  }

  return (
    <main className="page-shell narrow-shell">
      <button className="text-button back-button" onClick={onCancel}>
        <span aria-hidden="true">←</span> Back to dashboard
      </button>
      <div className="form-heading">
        <p className="eyebrow">A CLEAR FIRST STEP</p>
        <h1>Tell us what&apos;s happening.</h1>
        <p>We&apos;ll keep the report simple. You can add lesson details later.</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <label className="field">
          <span>What isn&apos;t working?</span>
          <select
            value={issueType}
            onChange={(event) => handleIssueChange(event.target.value)}
          >
            {ISSUE_TYPES.map((issue) => (
              <option value={issue.id} key={issue.id}>{issue.label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Device or location name</span>
          <input
            required
            maxLength={100}
            value={deviceName}
            onChange={(event) => setDeviceName(event.target.value)}
            placeholder="For example, Room 4 projector"
          />
        </label>

        <label className="field">
          <span>What are you seeing?</span>
          <textarea
            required
            maxLength={500}
            rows={3}
            value={symptom}
            onChange={(event) => setSymptom(event.target.value)}
          />
        </label>

        <label className="field">
          <span>Which lesson activity is affected?</span>
          <input
            required
            maxLength={300}
            value={lessonImpact}
            onChange={(event) => setLessonImpact(event.target.value)}
            placeholder="For example, showing a science diagram"
          />
        </label>

        <fieldset className="field urgency-field">
          <legend>How urgent is it?</legend>
          <div className="urgency-options">
            {(["low", "medium", "high"] as const).map((level) => (
              <label className="urgency-option" key={level}>
                <input
                  type="radio"
                  name="urgency"
                  value={level}
                  checked={urgency === level}
                  onChange={() => setUrgency(level)}
                />
                <span className={`urgency urgency-${level}`}>{level}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Anything else the technician should know? <em>Optional</em></span>
          <textarea
            maxLength={1000}
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Only include details useful for the handoff. No names needed."
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button className="button button-quiet" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            Create case <span aria-hidden="true">→</span>
          </button>
        </div>
        <p className="form-privacy">
          This report is stored only in this browser on this device.
        </p>
      </form>
    </main>
  );
}
