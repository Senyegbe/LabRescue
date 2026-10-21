"use client";

import type { FallbackActivity as Activity } from "../lib/types";
import { printSection } from "../lib/print";
import { useState } from "react";

interface FallbackActivityProps {
  activity: Activity;
  onCreateAnother: () => void;
  notice?: string;
}

export function FallbackActivityView({
  activity,
  onCreateAnother,
  notice,
}: FallbackActivityProps) {
  const [printError, setPrintError] = useState("");

  return (
    <section className="panel activity-panel">
      {notice && <p className="inline-notice" role="status">{notice}</p>}
      <div className="panel-heading screen-only">
        <div>
          <p className="eyebrow">YOUR LESSON BACKUP</p>
          <h2>{activity.title}</h2>
        </div>
        <span className={`source-pill source-${activity.source}`}>
          {activity.source === "gemini" ? "Gemini assisted" : "Built in"}
        </span>
      </div>
      <div className="activity-print" id="activity-print">
        <p className="eyebrow print-eyebrow">LABRESCUE · LESSON BACKUP</p>
        <h2>{activity.title}</h2>
        <p className="activity-meta">
          {activity.durationMinutes} minutes <span>·</span> {activity.learnerLevel}
        </p>
        <p className="activity-topic">
          <strong>Topic:</strong> {activity.topic}
        </p>
        <h3>Activity steps</h3>
        <ol className="activity-steps">
          {activity.instructions.map((instruction, index) => (
            <li key={`${index}-${instruction}`}>{instruction}</li>
          ))}
        </ol>
        <div className="activity-materials">
          <strong>Materials:</strong> {activity.materials.join(", ")}
        </div>
        <p className="activity-disclaimer">
          This activity is a suggestion. Adapt it to your learners and classroom.
          It does not require the reported equipment.
        </p>
      </div>
      <div className="activity-actions screen-only">
        <button
          className="button button-outline"
          onClick={() => setPrintError(printSection("activity-print"))}
        >
          Print activity
        </button>
        <button className="text-button" onClick={onCreateAnother}>
          Create another activity
        </button>
      </div>
      {printError && <p className="inline-notice" role="alert">{printError}</p>}
    </section>
  );
}
