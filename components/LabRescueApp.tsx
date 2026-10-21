"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { CaseWorkspace } from "./CaseWorkspace";
import { Dashboard } from "./Dashboard";
import { ReportForm } from "./ReportForm";
import type { ReportDetails } from "./ReportForm";
import type { GenerationResult } from "./FallbackActivityForm";
import {
  getCasesSnapshot,
  getServerCasesSnapshot,
  parseCasesSnapshot,
  saveCases,
  subscribeToCases,
} from "../lib/case-storage";
import { createBuiltInActivity } from "../lib/fallback-activity";
import { TROUBLESHOOTING_STEPS } from "../lib/troubleshooting";
import { fallbackActivitySchema } from "../lib/validation";
import type {
  CheckOutcome,
  FallbackActivity,
  FallbackInput,
  RescueCase,
} from "../lib/types";

type AppView = "dashboard" | "report" | "case";
const subscribeToHydration = () => () => {};
const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export function LabRescueApp() {
  const snapshot = useSyncExternalStore(
    subscribeToCases,
    getCasesSnapshot,
    getServerCasesSnapshot,
  );
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const parsedSnapshot = useMemo(() => parseCasesSnapshot(snapshot), [snapshot]);
  const cases = parsedSnapshot.cases;
  const [storageError, setStorageError] = useState("");
  const [view, setView] = useState<AppView>("dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const currentStorageError = storageError || parsedSnapshot.error;

  const selectedCase = useMemo(
    () => cases.find((rescueCase) => rescueCase.id === selectedCaseId),
    [cases, selectedCaseId],
  );

  const persistCases = useCallback(
    (nextCases: RescueCase[]): boolean => {
      try {
        saveCases(nextCases);
        setStorageError("");
        return true;
      } catch (error) {
        setStorageError(errorMessage(error));
        return false;
      }
    },
    [],
  );

  function createCase(details: ReportDetails) {
    let existingCases: RescueCase[];
    try {
      const current = parseCasesSnapshot(getCasesSnapshot());
      if (current.error) throw new Error(current.error);
      existingCases = current.cases;
    } catch (error) {
      setStorageError(errorMessage(error));
      return;
    }
    const now = new Date().toISOString();
    const nextCase: RescueCase = {
      ...details,
      id: crypto.randomUUID(),
      status: "open",
      createdAt: now,
      updatedAt: now,
      checkResults: [],
    };
    if (persistCases([nextCase, ...existingCases])) {
      setSelectedCaseId(nextCase.id);
      setView("case");
    }
  }

  function updateCase(
    id: string,
    update: (rescueCase: RescueCase) => RescueCase,
  ): boolean {
    let currentCases: RescueCase[];
    try {
      const current = parseCasesSnapshot(getCasesSnapshot());
      if (current.error) throw new Error(current.error);
      currentCases = current.cases;
    } catch (error) {
      setStorageError(errorMessage(error));
      return false;
    }
    const currentCase = currentCases.find((rescueCase) => rescueCase.id === id);
    if (!currentCase) {
      setStorageError("This case is no longer available. Return to the dashboard and open it again.");
      return false;
    }

    const updated = update(currentCase);
    const nextCases = currentCases.map((rescueCase) =>
      rescueCase.id === id ? { ...updated, updatedAt: new Date().toISOString() } : rescueCase,
    );
    return persistCases(nextCases);
  }

  function recordCheck(stepId: string, outcome: CheckOutcome) {
    if (!selectedCase) return;
    const stepExists = TROUBLESHOOTING_STEPS[selectedCase.issueType].some(
      (step) => step.id === stepId,
    );
    const stopped = selectedCase.checkResults.some(
      (result) =>
        result.outcome === "working-now" ||
        result.outcome === "stop-and-escalate",
    );
    if (!stepExists || stopped || selectedCase.status !== "open") {
      setStorageError("That check cannot be recorded for this case.");
      return;
    }

    updateCase(selectedCase.id, (current) => ({
      ...current,
      checkResults: [
        ...current.checkResults.filter((result) => result.stepId !== stepId),
        { stepId, outcome, recordedAt: new Date().toISOString() },
      ],
    }));
  }

  async function generateActivity(
    input: FallbackInput,
    useGemini: boolean,
  ): Promise<GenerationResult> {
    if (!selectedCase) {
      return { saved: false, message: "Open a case before creating an activity." };
    }

    let activity: FallbackActivity = createBuiltInActivity(input);
    let message = "Built-in activity saved to this case.";

    if (useGemini) {
      try {
        const response = await fetch("/api/fallback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-LabRescue-AI-Consent": "true",
          },
          body: JSON.stringify({
            topic: input.topic,
            learnerLevel: input.learnerLevel,
            availableMaterials: input.availableMaterials,
            failedEquipmentType: input.failedEquipmentType,
          }),
        });

        if (!response.ok) {
          throw new Error("Gemini is unavailable.");
        }
        const responseBody: unknown = await response.json();
        if (
          typeof responseBody !== "object" ||
          responseBody === null ||
          !("activity" in responseBody)
        ) {
          throw new Error("Gemini returned an invalid response.");
        }
        const parsedActivity = fallbackActivitySchema.safeParse(
          responseBody.activity,
        );
        if (!parsedActivity.success) {
          throw new Error("Gemini returned an incomplete activity.");
        }
        activity = {
          ...input,
          ...parsedActivity.data,
          source: "gemini",
          createdAt: new Date().toISOString(),
        };
        message = "Gemini activity saved to this case.";
      } catch {
        message =
          "Gemini could not provide a usable activity. The built-in activity was saved instead.";
      }
    }

    const saved = updateCase(selectedCase.id, (current) => ({
      ...current,
      activity,
    }));
    return saved
      ? { saved: true, message }
      : { saved: false, message: "The activity could not be saved. Review the storage warning above and try again." };
  }

  function resolveCase() {
    if (!selectedCase || selectedCase.status !== "open") return;
    if (
      window.confirm(
        "Only resolve this case after confirming with the technician that the equipment is fixed. Has the repair been confirmed?",
      )
    ) {
      updateCase(selectedCase.id, (current) => ({
        ...current,
        status: "resolved",
      }));
    }
  }

  if (!isHydrated) {
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="brand-mark">LR</span>
        <p>Opening your classroom workspace…</p>
      </main>
    );
  }

  if (currentStorageError && cases.length === 0 && view !== "report") {
    return (
      <main className="page-shell narrow-shell">
        <Link className="brand" href="/" aria-label="LabRescue home">
          <span className="brand-mark">LR</span>
          <span><strong>LabRescue</strong><small>Classroom continuity &amp; repair</small></span>
        </Link>
        <section className="storage-error-card" role="alert">
          <p className="eyebrow">BROWSER STORAGE ISSUE</p>
          <h1>Your saved cases were not changed.</h1>
          <p>{currentStorageError}</p>
          <p>
            LabRescue will not overwrite unreadable data. Check your browser
            storage settings before continuing.
          </p>
          <button
            className="button button-outline"
            onClick={() => window.location.reload()}
          >
            Try loading again
          </button>
        </section>
      </main>
    );
  }

  if (view === "report") {
    return (
      <>
        {currentStorageError && <div className="error-banner app-error" role="alert">{currentStorageError}</div>}
        <ReportForm
          onSubmit={createCase}
          onCancel={() => setView("dashboard")}
        />
      </>
    );
  }

  if (view === "case" && selectedCase) {
    return (
      <CaseWorkspace
        rescueCase={selectedCase}
        storageError={currentStorageError}
        onBack={() => {
          setView("dashboard");
        }}
        onRecordCheck={recordCheck}
        onGenerateActivity={generateActivity}
        onResolve={resolveCase}
      />
    );
  }

  return (
    <>
      {currentStorageError && <div className="error-banner app-error" role="alert">{currentStorageError}</div>}
      <Dashboard
        cases={cases}
        onReport={() => {
          if (currentStorageError) return;
          setView("report");
        }}
        onOpenCase={(id) => {
          setSelectedCaseId(id);
          setView("case");
        }}
      />
    </>
  );
}
