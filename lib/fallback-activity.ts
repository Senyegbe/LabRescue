import type { FallbackActivity, FallbackInput } from "./types";

const equipmentTerms =
  /\b(projector|computer|laptop|tablet|phone|cellphone|internet|wi-?fi|screen|display|monitor|video|website|online|slides?|slideshow|television|smartboard|smart board|digital|electronic|device|technology|equipment|audio|speaker|camera|app|browser|webpage)\b/i;

function display(value: string, fallback: string): string {
  return value.trim() || fallback;
}

export function createBuiltInActivity(
  input: FallbackInput,
  createdAt = new Date().toISOString(),
): FallbackActivity {
  const topic = display(input.topic, "today's lesson topic");
  const learnerLevel = display(input.learnerLevel, "your learners");
  const availableMaterials = input.availableMaterials.trim();
  const safeOptionalMaterials =
    availableMaterials && !equipmentTerms.test(availableMaterials);

  return {
    ...input,
    topic,
    learnerLevel,
    title: `Talk it through: ${topic.slice(0, 80)}${topic.length > 80 ? "…" : ""}`,
    durationMinutes: 15,
    instructions: [
      `Introduce ${topic.slice(0, 100)} in language that suits ${learnerLevel.slice(0, 60)}. Ask learners to think quietly about one thing they already know.`,
      "Invite pairs or small groups to share their ideas aloud. Ask each group to agree on one important question or example.",
      "Bring the class together. Hear a few responses, clarify one key idea, and invite learners to explain it in their own words.",
      "Close with a quick verbal check: ask each learner to share one new idea or question before the next lesson step.",
    ],
    materials: safeOptionalMaterials
      ? [`Optional: ${availableMaterials.slice(0, 68)}${availableMaterials.length > 68 ? "…" : ""}`]
      : ["No materials needed"],
    source: "built-in",
    createdAt,
  };
}

export function isNoEquipmentActivity(activity: {
  title: string;
  instructions: string[];
  materials: string[];
}): boolean {
  const activityText = [
    activity.title,
    ...activity.instructions,
    ...activity.materials,
  ].join(" ");
  return !equipmentTerms.test(activityText);
}
