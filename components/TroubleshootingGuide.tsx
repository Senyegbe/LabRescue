"use client";

import { TROUBLESHOOTING_STEPS } from "../lib/troubleshooting";
import type { CheckOutcome, CheckResult, IssueType } from "../lib/types";

interface TroubleshootingGuideProps {
  issueType: IssueType;
  checkResults: CheckResult[];
  onRecord: (stepId: string, outcome: CheckOutcome) => void;
}

const outcomeLabels: Record<CheckOutcome, string> = {
  "still-not-working": "Still not working",
  "working-now": "It is working now",
  "could-not-try": "Could not try this check",
  "stop-and-escalate": "Stop and contact the technician",
};

export function TroubleshootingGuide({
  issueType,
  checkResults,
  onRecord,
}: TroubleshootingGuideProps) {
  const steps = TROUBLESHOOTING_STEPS[issueType];
  const stopped = checkResults.some(
    (result) =>
      result.outcome === "working-now" ||
      result.outcome === "stop-and-escalate",
  );
  const nextStep = stopped
    ? undefined
    : steps.find(
        (step) => !checkResults.some((result) => result.stepId === step.id),
      );

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">SAFE CHECKS</p>
          <h2>Try one step at a time</h2>
        </div>
        <span className="step-count">
          {Math.min(checkResults.length, steps.length)} / {steps.length}
        </span>
      </div>
      <p className="safety-banner">
        <span aria-hidden="true">!</span>
        Never open equipment or handle exposed wiring. If anything looks
        damaged, smells unusual, feels hot, or seems unsafe, stop and contact
        your technician.
      </p>
      <ol className="check-list">
        {steps.map((step, index) => {
          const result = checkResults.find(
            (item) => item.stepId === step.id,
          );
          const isNext = nextStep?.id === step.id;
          return (
            <li
              className={`check-item ${result ? "check-complete" : ""} ${isNext ? "check-next" : ""}`}
              key={step.id}
            >
              <span className="check-number">
                {result?.outcome === "working-now" ? "✓" : index + 1}
              </span>
              <div className="check-content">
                <h3>{step.title}</h3>
                <p>{step.instruction}</p>
                <p className="stop-condition">
                  <strong>Safety boundary:</strong> {step.stopCondition}
                </p>
                {result ? (
                  <span className={`check-outcome outcome-${result.outcome}`}>
                    {outcomeLabels[result.outcome]}
                  </span>
                ) : isNext ? (
                  <div className="check-actions">
                    <button
                      className="button button-small button-outline"
                      onClick={() => onRecord(step.id, "still-not-working")}
                    >
                      Still not working
                    </button>
                    <button
                      className="button button-small button-success"
                      onClick={() => onRecord(step.id, "working-now")}
                    >
                      It&apos;s working
                    </button>
                    <button
                      className="text-button stop-button"
                      onClick={() => onRecord(step.id, "stop-and-escalate")}
                    >
                      Stop &amp; contact technician
                    </button>
                  </div>
                ) : (
                  <span className="check-pending">Up next</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
