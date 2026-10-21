"use client";

import { ISSUE_TYPES } from "../lib/types";
import type { RescueCase } from "../lib/types";
import { TROUBLESHOOTING_STEPS } from "../lib/troubleshooting";
import { printSection } from "../lib/print";
import { useState } from "react";

interface TechnicianHandoffProps {
  rescueCase: RescueCase;
}

const outcomeLabels: Record<string, string> = {
  "still-not-working": "Still not working",
  "working-now": "Working now",
  "could-not-try": "Could not try",
  "stop-and-escalate": "Stopped and contacted technician",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function TechnicianHandoff({ rescueCase }: TechnicianHandoffProps) {
  const [printError, setPrintError] = useState("");
  const issue = ISSUE_TYPES.find((item) => item.id === rescueCase.issueType);
  const steps = TROUBLESHOOTING_STEPS[rescueCase.issueType];

  return (
    <section className="panel handoff-panel">
      <div className="panel-heading screen-only">
        <div>
          <p className="eyebrow">CLEAR INFORMATION FOR THE TECHNICIAN</p>
          <h2>Technician handoff</h2>
        </div>
        <button
          className="button button-outline"
          onClick={() => setPrintError(printSection("handoff-print"))}
        >
          Print handoff
        </button>
      </div>
      {printError && <p className="inline-notice screen-only" role="alert">{printError}</p>}
      <div className="handoff-print" id="handoff-print">
        <p className="eyebrow print-eyebrow">LABRESCUE · TECHNICIAN HANDOFF</p>
        <h2>{rescueCase.deviceName}</h2>
        <p className="handoff-created">Prepared {formatDate(rescueCase.updatedAt)}</p>
        <dl className="handoff-details">
          <div><dt>Equipment type</dt><dd>{issue?.device ?? "Classroom equipment"}</dd></div>
          <div><dt>Reported issue</dt><dd>{issue?.label ?? "Equipment issue"}</dd></div>
          <div><dt>Urgency</dt><dd>{rescueCase.urgency}</dd></div>
          <div><dt>Case status</dt><dd>{rescueCase.status}</dd></div>
          <div><dt>Lesson affected</dt><dd>{rescueCase.lessonImpact}</dd></div>
          <div><dt>Symptoms</dt><dd>{rescueCase.symptom}</dd></div>
          {rescueCase.notes && (
            <div><dt>Additional notes</dt><dd>{rescueCase.notes}</dd></div>
          )}
        </dl>
        <h3>Checks and outcomes</h3>
        {rescueCase.checkResults.length === 0 ? (
          <p>No checks have been recorded.</p>
        ) : (
          <ol className="handoff-checks">
            {rescueCase.checkResults.map((result) => {
              const step = steps.find((item) => item.id === result.stepId);
              return (
                <li key={result.stepId}>
                  <strong>{step?.title ?? "Check"}</strong>
                  <span>{outcomeLabels[result.outcome] ?? result.outcome}</span>
                </li>
              );
            })}
          </ol>
        )}
        {rescueCase.activity && (
          <div className="handoff-activity">
            <h3>Lesson fallback prepared</h3>
            <p><strong>{rescueCase.activity.title}</strong> · {rescueCase.activity.durationMinutes} minutes</p>
          </div>
        )}
        <p className="handoff-note">
          This handoff records the teacher&apos;s observations; it does not confirm
          a physical fault or repair.
        </p>
      </div>
    </section>
  );
}
