import { z } from "zod";
import { ISSUE_TYPES } from "./types";

const issueTypeValues = ISSUE_TYPES.map((issue) => issue.id) as [
  (typeof ISSUE_TYPES)[number]["id"],
  ...(typeof ISSUE_TYPES)[number]["id"][],
];

export const fallbackInputSchema = z.object({
  topic: z.string().trim().max(160),
  learnerLevel: z.string().trim().max(100),
  availableMaterials: z.string().trim().max(300),
  failedEquipmentType: z.enum(issueTypeValues),
}).strict();

export const fallbackActivitySchema = z.object({
  title: z.string().trim().min(3).max(100),
  durationMinutes: z.number().int().min(5).max(90),
  instructions: z.array(z.string().trim().min(8).max(300)).min(3).max(8),
  materials: z.array(z.string().trim().min(1).max(80)).max(8),
});

export const reportInputSchema = z.object({
  issueType: z.enum(issueTypeValues),
  deviceName: z.string().trim().min(1).max(100),
  symptom: z.string().trim().min(1).max(500),
  lessonImpact: z.string().trim().min(1).max(300),
  urgency: z.enum(["low", "medium", "high"]),
  notes: z.string().trim().max(1000),
});

const checkResultSchema = z.object({
  stepId: z.string().min(1),
  outcome: z.enum([
    "still-not-working",
    "working-now",
    "could-not-try",
    "stop-and-escalate",
  ]),
  recordedAt: z.string().datetime(),
});

const activityRecordSchema = fallbackActivitySchema.extend({
  topic: z.string().max(160),
  learnerLevel: z.string().max(100),
  availableMaterials: z.string().max(300),
  failedEquipmentType: z.enum(issueTypeValues),
  source: z.enum(["built-in", "gemini"]),
  createdAt: z.string().datetime(),
});

export const rescueCaseSchema = z.object({
  id: z.string().min(1),
  issueType: z.enum(issueTypeValues),
  deviceName: z.string().min(1).max(100),
  symptom: z.string().min(1).max(500),
  lessonImpact: z.string().min(1).max(300),
  urgency: z.enum(["low", "medium", "high"]),
  notes: z.string().max(1000),
  status: z.enum(["open", "resolved"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  checkResults: z.array(checkResultSchema),
  activity: activityRecordSchema.optional(),
});

export const caseCollectionSchema = z.array(rescueCaseSchema);
