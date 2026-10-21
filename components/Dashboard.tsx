"use client";

import { useState } from "react";
import Link from "next/link";
import { ISSUE_TYPES } from "../lib/types";
import type { RescueCase } from "../lib/types";

interface DashboardProps {
  cases: RescueCase[];
  onReport: () => void;
  onOpenCase: (id: string) => void;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Dashboard({ cases, onReport, onOpenCase }: DashboardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const openCases = cases
    .filter((rescueCase) => rescueCase.status === "open")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const resolvedCases = cases
    .filter((rescueCase) => rescueCase.status === "resolved")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="LabRescue home">
          <span className="brand-mark" aria-hidden="true">
            LR
          </span>
          <span>
            <strong>LabRescue</strong>
            <small>Classroom continuity &amp; repair</small>
          </span>
        </Link>
        <button className="button button-primary topbar-action" onClick={onReport}>
          <span aria-hidden="true">＋</span> Report a problem
        </button>
      </header>

      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="welcome-copy">
          <p className="eyebrow">YOUR CLASSROOM SUPPORT</p>
          <h1 id="welcome-title">Every lesson deserves a chance.</h1>
          <p>
            When technology lets you down, we&apos;re here to help you find the
            next step.
          </p>
          <button className="button button-light" onClick={onReport}>
            Report a problem <span aria-hidden="true">→</span>
          </button>
          <div className="welcome-footnote">
            <span aria-hidden="true">✳</span>
            Keep the learning going. We&apos;ll help with safe checks, a backup
            activity, and a clear handoff.
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="art-book book-back" />
          <div className="art-book book-front">
            <span>LESSON</span>
            <b>↗</b>
          </div>
          <div className="art-spark spark-one">✦</div>
          <div className="art-spark spark-two">✳</div>
          <div className="art-caption">A fresh start, right here.</div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>Open cases <span className="count-pill">{openCases.length}</span></h2>
        </div>
        <span className="muted small-text">One guided case at a time</span>
      </div>

      {openCases.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon" aria-hidden="true">✳</div>
          <h3>Keep the learning going.</h3>
          <p>
            {cases.length === 0
              ? "When classroom equipment fails, start a case and we'll help you choose a safe next step."
              : "You have no open cases right now. Your resolved cases are still available in history."}
          </p>
          <button className="button button-primary" onClick={onReport}>
            Start a report <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <section className="case-grid" aria-label="Open cases">
          {openCases.map((rescueCase) => {
            const issue = ISSUE_TYPES.find(
              (item) => item.id === rescueCase.issueType,
            );
            return (
              <article className="case-card" key={rescueCase.id}>
                <div className="case-card-top">
                  <span className="device-icon" aria-hidden="true">
                    {rescueCase.issueType === "projector-no-signal"
                      ? "▣"
                      : rescueCase.issueType === "computer-wont-start"
                        ? "▤"
                        : "⌁"}
                  </span>
                  <span className={`urgency urgency-${rescueCase.urgency}`}>
                    {rescueCase.urgency} urgency
                  </span>
                </div>
                <p className="eyebrow">{issue?.label ?? "Classroom equipment"}</p>
                <h3>{rescueCase.deviceName}</h3>
                <p className="case-symptom">{rescueCase.symptom}</p>
                <div className="case-card-meta">
                  <span className="status-dot" />
                  Open <span aria-hidden="true">·</span> Updated{" "}
                  {formatDate(rescueCase.updatedAt)}
                </div>
                <button
                  className="case-card-link"
                  onClick={() => onOpenCase(rescueCase.id)}
                  aria-label={`Continue case for ${rescueCase.deviceName}`}
                >
                  Continue case <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </section>
      )}

      <section className="history-section">
        <button
          className="history-toggle"
          onClick={() => setShowHistory((current) => !current)}
          aria-expanded={showHistory}
        >
          <span>
            <strong>Case history</strong>
            <span className="muted"> {resolvedCases.length} resolved</span>
          </span>
          <span aria-hidden="true">{showHistory ? "−" : "+"}</span>
        </button>
        {showHistory && (
          resolvedCases.length === 0 ? (
            <p className="history-empty">Resolved cases will be saved here.</p>
          ) : (
            <div className="history-list">
              {resolvedCases.map((rescueCase) => (
                <button
                  className="history-row"
                  key={rescueCase.id}
                  onClick={() => onOpenCase(rescueCase.id)}
                >
                  <span>
                    <strong>{rescueCase.deviceName}</strong>
                    <small>{rescueCase.symptom}</small>
                  </span>
                  <span className="history-date">
                    Resolved · {formatDate(rescueCase.updatedAt)} <span aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>
          )
        )}
      </section>

      <footer className="privacy-note">
        <span aria-hidden="true">◉</span>
        Your cases stay in this browser on this device. They aren&apos;t synced or
        backed up, and may be lost if browser data is cleared.
      </footer>
    </main>
  );
}
