import { caseCollectionSchema } from "./validation";
import type { RescueCase } from "./types";

const STORAGE_KEY = "labrescue.cases.v1";
const STORAGE_ERROR_PREFIX = "labrescue-storage-error:";
const listeners = new Set<() => void>();

export function subscribeToCases(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getCasesSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return `${STORAGE_ERROR_PREFIX}Browser storage could not be read. Check your browser storage settings.`;
  }
}

export function getServerCasesSnapshot(): string {
  return "[]";
}

export function parseCasesSnapshot(
  snapshot: string,
): { cases: RescueCase[]; error: string } {
  if (snapshot.startsWith(STORAGE_ERROR_PREFIX)) {
    return { cases: [], error: snapshot.slice(STORAGE_ERROR_PREFIX.length) };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(snapshot);
  } catch {
    return {
      cases: [],
      error:
        "Saved case data could not be read. It has not been changed. Do not clear browser data before recovering it.",
    };
  }

  const result = caseCollectionSchema.safeParse(parsed);
  if (!result.success) {
    return {
      cases: [],
      error: "Saved case data is not in a supported format. It has not been changed.",
    };
  }

  return { cases: result.data, error: "" };
}

export function saveCases(cases: RescueCase[]): void {
  const validated = caseCollectionSchema.safeParse(cases);
  if (!validated.success) {
    throw new Error("The case update could not be validated and was not saved.");
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated.data));
  for (const listener of listeners) listener();
}
