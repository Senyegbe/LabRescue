export const ISSUE_TYPES = [
  {
    id: "projector-no-signal",
    label: "Projector shows “No Signal”",
    device: "Projector",
  },
  {
    id: "computer-wont-start",
    label: "Computer will not start",
    device: "Classroom computer",
  },
  {
    id: "internet-unavailable",
    label: "Internet is unavailable",
    device: "Classroom internet",
  },
] as const;

export type IssueType = (typeof ISSUE_TYPES)[number]["id"];
export type Urgency = "low" | "medium" | "high";
export type CaseStatus = "open" | "resolved";
export type CheckOutcome =
  | "still-not-working"
  | "working-now"
  | "could-not-try"
  | "stop-and-escalate";

export interface CheckResult {
  stepId: string;
  outcome: CheckOutcome;
  recordedAt: string;
}

export interface FallbackActivity {
  topic: string;
  learnerLevel: string;
  availableMaterials: string;
  failedEquipmentType: IssueType;
  title: string;
  durationMinutes: number;
  instructions: string[];
  materials: string[];
  source: "built-in" | "gemini";
  createdAt: string;
}

export interface RescueCase {
  id: string;
  issueType: IssueType;
  deviceName: string;
  symptom: string;
  lessonImpact: string;
  urgency: Urgency;
  notes: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  checkResults: CheckResult[];
  activity?: FallbackActivity;
}

export interface FallbackInput {
  topic: string;
  learnerLevel: string;
  availableMaterials: string;
  failedEquipmentType: IssueType;
}
