"use client";

import { useState } from "react";
import type { FallbackInput } from "../lib/types";

export interface GenerationResult {
  saved: boolean;
  message: string;
}

interface FallbackActivityFormProps {
  initialValues: FallbackInput;
  onGenerate: (
    input: FallbackInput,
    useGemini: boolean,
  ) => Promise<GenerationResult>;
  onCancel: () => void;
}

export function FallbackActivityForm({
  initialValues,
  onGenerate,
  onCancel,
}: FallbackActivityFormProps) {
  const [topic, setTopic] = useState(initialValues.topic);
  const [learnerLevel, setLearnerLevel] = useState(initialValues.learnerLevel);
  const [availableMaterials, setAvailableMaterials] = useState(
    initialValues.availableMaterials,
  );
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function generate(useGemini: boolean) {
    setBusy(true);
    setNotice("");
    try {
      const result = await onGenerate(
        {
          topic,
          learnerLevel,
          availableMaterials,
          failedEquipmentType: initialValues.failedEquipmentType,
        },
        useGemini,
      );
      setNotice(result.message);
      if (result.saved) onCancel();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The activity could not be created. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel fallback-form-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">KEEP THE LEARNING GOING</p>
          <h2>Make a no-equipment activity</h2>
        </div>
      </div>
      <p className="muted">
        Share only general lesson details. Leave out names or identifying
        information. You can continue with just a topic—or leave the fields
        blank.
      </p>
      <div className="fallback-fields">
        <label className="field">
          <span>Lesson topic</span>
          <input
            maxLength={160}
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="For example, plant life cycles"
          />
        </label>
        <label className="field">
          <span>Learner level</span>
          <input
            maxLength={100}
            value={learnerLevel}
            onChange={(event) => setLearnerLevel(event.target.value)}
            placeholder="For example, upper primary"
          />
        </label>
        <label className="field">
          <span>Available materials <em>Optional</em></span>
          <input
            maxLength={300}
            value={availableMaterials}
            onChange={(event) => setAvailableMaterials(event.target.value)}
            placeholder="For example, paper and pencils"
          />
        </label>
      </div>

      <div className="privacy-disclosure">
        <p className="eyebrow">OPTIONAL GEMINI GENERATION</p>
        <p>
          If you choose Gemini, only the <strong>lesson topic, learner level,
          available materials, and failed equipment type</strong> will be sent
          to Google. No case ID, report notes, names, or troubleshooting history
          are included. Google&apos;s terms differ by service tier: with unpaid
          API use, prompts and responses may be used to improve products, may
          be reviewed by humans, and are retained for up to 55 days for abuse
          monitoring. Paid services do not use prompts and responses to improve
          products, but may log them for a limited period for safety and legal
          purposes. Google&apos;s terms also prohibit making Gemini API
          available through apps directed to or likely accessed by people
          under 18. Use Gemini only in a teacher-facing context, never for
          student-facing access, and do not send sensitive, confidential, or
          personal information. See the current{" "}
          <a href="https://ai.google.dev/gemini-api/terms">Gemini API terms</a>,{" "}
          <a href="https://ai.google.dev/gemini-api/docs/usage-policies">
            usage policies
          </a>
          , and <a href="https://ai.google.dev/gemini-api/docs/pricing">pricing</a>.
          AI may be wrong. The built-in option below does not send these details
          to Google.
        </p>
        <label className="consent-check">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>I understand and agree to send these details to Google for this activity.</span>
        </label>
      </div>

      {notice && <p className="inline-notice" role="status">{notice}</p>}
      <div className="form-actions fallback-actions">
        <button className="button button-quiet" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          className="button button-outline"
          onClick={() => void generate(false)}
          disabled={busy}
        >
          {busy ? "Creating…" : "Use built-in activity"}
        </button>
        <button
          className="button button-primary"
          onClick={() => void generate(true)}
          disabled={busy || !consent}
          title={!consent ? "Agree to the disclosure to enable Gemini" : undefined}
        >
          {busy ? "Creating…" : "Generate with Gemini"}
        </button>
      </div>
    </section>
  );
}
