"use client";

import { useState } from "react";
import { FallbackActivityForm } from "./FallbackActivityForm";
import type { GenerationResult } from "./FallbackActivityForm";
import { FallbackActivityView } from "./FallbackActivity";
import { TechnicianHandoff } from "./TechnicianHandoff";
import { TroubleshootingGuide } from "./TroubleshootingGuide";
import { ISSUE_TYPES } from "../lib/types";
import type {
  CheckOutcome,
  FallbackInput,
  RescueCase,
} from "../lib/types";
import {
  canConfirmResolution,
  TROUBLESHOOTING_STEPS,
} from "../lib/troubleshooting";

interface CaseWorkspaceProps {
  rescueCase: RescueCase;
  storageError: string;
  onBack: () => void;
  onRecordCheck: (stepId: string, outcome: CheckOutcome) => void;
  onGenerateActivity: (
    input: FallbackInput,
    useGemini: boolean,
  ) => Promise<GenerationResult>;
  onResolve: () => void;
}

export function CaseWorkspace({
  rescueCase,
  storageError,
  onBack,
  onRecordCheck,
  onGenerateActivity,
  onResolve,
}: CaseWorkspaceProps) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [generationNotice, setGenerationNotice] = useState("");
  const issue = ISSUE_TYPES.find((item) => item.id === rescueCase.issueType);
  const steps = TROUBLESHOOTING_STEPS[rescueCase.issueType];
  const workingNow = rescueCase.checkResults.some(
    (result) => result.outcome === "working-now",
  );
  const stoppedForSafety = rescueCase.checkResults.some(
    (result) => result.outcome === "stop-and-escalate",
  );
  const allChecksDone = steps.every((step) =>
    rescueCase.checkResults.some((result) => result.stepId === step.id),
  );
  const resolutionAvailable = canConfirmResolution(
    rescueCase.issueType,
    rescueCase.checkResults,
  );
  const fallbackReady = !workingNow && (stoppedForSafety || allChecksDone);
  const initialValues: FallbackInput = {
    topic: rescueCase.activity?.topic ?? rescueCase.lessonImpact,
    learnerLevel: rescueCase.activity?.learnerLevel ?? "",
    availableMaterials: rescueCase.activity?.availableMaterials ?? "",
    failedEquipmentType: rescueCase.issueType,
  };

  return (
    <main className="page-shell case-shell">
      <button className="text-button back-button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to dashboard
      </button>
      {storageError && (
        <div className="error-banner" role="alert">
          <strong>Changes may not be saved.</strong> {storageError}
        </div>
      )}
      <header className="case-page-heading">
        <div>
          <p className="eyebrow">CASE WORKSPACE · {issue?.device ?? "EQUIPMENT"}</p>
          <h1>{rescueCase.deviceName}</h1>
          <p className="case-heading-summary">{rescueCase.symptom}</p>
        </div>
        <div className="case-heading-badges">
          <span className={`urgency urgency-${rescueCase.urgency}`}>
            {rescueCase.urgency} urgency
          </span>
          <span className={`case-status status-${rescueCase.status}`}>
            <span className="status-dot" /> {rescueCase.status}
          </span>
        </div>
      </header>

      <div className="case-overview">
        <div>
          <span className="overview-label">Lesson affected</span>
          <strong>{rescueCase.lessonImpact}</strong>
        </div>
        {rescueCase.notes && (
          <div>
            <span className="overview-label">Technician note</span>
            <strong>{rescueCase.notes}</strong>
          </div>
        )}
        <div>
          <span className="overview-label">Opened</span>
          <strong>{new Date(rescueCase.createdAt).toLocaleString()}</strong>
        </div>
      </div>

      {rescueCase.status === "open" ? (
        <TroubleshootingGuide
          issueType={rescueCase.issueType}
          checkResults={rescueCase.checkResults}
          onRecord={onRecordCheck}
        />
      ) : (
        <section className="resolved-banner">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>This case is resolved.</strong>
            <p>Its history and handoff remain available here.</p>
          </div>
        </section>
      )}

      {resolutionAvailable && rescueCase.status === "open" && (
        <section className="resolution-panel">
          <div>
            <p className="eyebrow">REPAIR CONFIRMATION</p>
            <h2>Confirm with your technician</h2>
            <p>
              Keep this case open until the technician confirms the repair.
              Then mark it resolved.
            </p>
          </div>
          <button
            className="button button-primary"
            onClick={onResolve}
          >
            I confirmed the repair
          </button>
        </section>
      )}

      {fallbackReady && rescueCase.status === "open" && (
        <section className="fallback-section">
          {!showActivityForm && rescueCase.activity ? (
            <FallbackActivityView
              activity={rescueCase.activity}
              onCreateAnother={() => setShowActivityForm(true)}
              notice={generationNotice}
            />
          ) : !showActivityForm ? (
            <div className="lesson-prompt">
              <div className="lesson-prompt-icon" aria-hidden="true">✳</div>
              <div>
                <p className="eyebrow">THE LESSON CAN STILL CONTINUE</p>
                <h2>Keep my lesson going</h2>
                <p>
                  Create a practical activity that doesn&apos;t rely on the
                  equipment that failed.
                </p>
              </div>
              <button
                className="button button-primary"
                onClick={() => setShowActivityForm(true)}
              >
                Make a backup activity <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : (
            <FallbackActivityForm
              initialValues={initialValues}
              onGenerate={async (input, useGemini) => {
                const result = await onGenerateActivity(input, useGemini);
                if (result.saved) setGenerationNotice(result.message);
                return result;
              }}
              onCancel={() => setShowActivityForm(false)}
            />
          )}
        </section>
      )}

      <TechnicianHandoff rescueCase={rescueCase} />
      <p className="case-honesty-note">
        LabRescue records what you observe. It cannot diagnose equipment or
        confirm a physical repair.
      </p>
    </main>
  );
}
