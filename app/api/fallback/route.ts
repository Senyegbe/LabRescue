import { NextResponse } from "next/server";
import { fallbackActivitySchema, fallbackInputSchema } from "../../../lib/validation";
import { isNoEquipmentActivity } from "../../../lib/fallback-activity";
import { ISSUE_TYPES } from "../../../lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function extractResponseText(payload: unknown): string | null {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) return null;
  const firstCandidate: unknown = payload.candidates[0];
  if (!isRecord(firstCandidate) || !isRecord(firstCandidate.content)) return null;
  const parts = firstCandidate.content.parts;
  if (!Array.isArray(parts)) return null;

  const textParts = parts.flatMap((part: unknown) =>
    isRecord(part) && typeof part.text === "string" ? [part.text] : [],
  );
  return textParts.join("\n").trim() || null;
}

export async function POST(request: Request) {
  if (request.headers.get("x-labrescue-ai-consent") !== "true") {
    return NextResponse.json(
      { error: "Teacher consent is required for Gemini." },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = fallbackInputSchema.safeParse(body);
  if (!input.success) {
    return NextResponse.json({ error: "Lesson details are invalid." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini is not configured. Use the built-in activity instead." },
      { status: 503 },
    );
  }

  const issue = ISSUE_TYPES.find(
    (item) => item.id === input.data.failedEquipmentType,
  );
  const prompt = [
    "Create one practical classroom learning activity as JSON.",
    "Return only JSON with title, durationMinutes, instructions, and materials.",
    "Use the requested topic and learner level when provided.",
    "Do not use or depend on any equipment, screens, internet, devices, or digital content.",
    "Prefer spoken discussion and learner interaction. Any listed materials must be optional, not required.",
    "Do not mention or use the failed equipment type.",
    `Topic: ${input.data.topic || "not specified"}`,
    `Learner level: ${input.data.learnerLevel || "not specified"}`,
    `Available materials: ${input.data.availableMaterials || "none specified"}`,
    `Failed equipment type: ${issue?.device ?? "classroom equipment"}`,
  ].join("\n");

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
        signal: AbortSignal.timeout(20_000),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Gemini could not complete the request." },
        { status: 502 },
      );
    }

    const payload: unknown = await response.json();
    const text = extractResponseText(payload);
    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned an empty activity." },
        { status: 502 },
      );
    }

    let decoded: unknown;
    try {
      decoded = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Gemini returned malformed activity data." },
        { status: 502 },
      );
    }

    const activity = fallbackActivitySchema.safeParse(decoded);
    if (!activity.success || !isNoEquipmentActivity(activity.data)) {
      return NextResponse.json(
        { error: "Gemini returned an incomplete or unsuitable activity." },
        { status: 502 },
      );
    }

    return NextResponse.json({ activity: activity.data });
  } catch {
    return NextResponse.json(
      { error: "Gemini is unavailable. Use the built-in activity instead." },
      { status: 502 },
    );
  }
}
