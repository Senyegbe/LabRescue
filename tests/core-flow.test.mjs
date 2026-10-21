import assert from "node:assert/strict";
import test from "node:test";

import { createBuiltInActivity, isNoEquipmentActivity } from "../lib/fallback-activity.ts";
import { canConfirmResolution, TROUBLESHOOTING_STEPS } from "../lib/troubleshooting.ts";
import { ISSUE_TYPES } from "../lib/types.ts";

const timestamp = "2025-01-01T17:00:00.000Z";

function check(stepId, outcome = "still-not-working") {
  return { stepId, outcome, recordedAt: timestamp };
}

test("all supported faults have three bounded, authored checks", () => {
  assert.deepEqual(
    ISSUE_TYPES.map((issue) => issue.id),
    ["projector-no-signal", "computer-wont-start", "internet-unavailable"],
  );

  for (const { id } of ISSUE_TYPES) {
    const steps = TROUBLESHOOTING_STEPS[id];
    assert.equal(steps.length, 3, `${id} should have three checks`);
    assert.equal(new Set(steps.map((step) => step.id)).size, steps.length);
    for (const step of steps) {
      assert.ok(step.title.trim(), `${id}/${step.id} needs a title`);
      assert.ok(step.instruction.trim(), `${id}/${step.id} needs an instruction`);
      if (/skip this check/i.test(step.stopCondition)) {
        assert.match(step.stopCondition, /do not/i);
      } else {
        assert.match(step.stopCondition, /stop/i);
        assert.match(step.stopCondition, /technician/i);
      }
    }
  }
});

test("built-in fallback works for every fault without using classroom equipment", () => {
  for (const { id } of ISSUE_TYPES) {
    const activity = createBuiltInActivity(
      {
        topic: "Plant life cycles",
        learnerLevel: "Upper primary",
        availableMaterials: "paper and pencils",
        failedEquipmentType: id,
      },
      timestamp,
    );

    assert.equal(activity.source, "built-in");
    assert.equal(activity.createdAt, timestamp);
    assert.match(activity.title, /Plant life cycles/);
    assert.ok(activity.instructions.length >= 3);
    assert.ok(activity.durationMinutes > 0);
    assert.equal(isNoEquipmentActivity(activity), true);
  }
});

test("unsafe optional materials are not required by the built-in fallback", () => {
  const activity = createBuiltInActivity({
    topic: "Plant life cycles",
    learnerLevel: "Upper primary",
    availableMaterials: "projector and laptop",
    failedEquipmentType: "projector-no-signal",
  });

  assert.deepEqual(activity.materials, ["No materials needed"]);
  assert.equal(isNoEquipmentActivity(activity), true);
});

test("blank lesson details still produce a complete built-in fallback", () => {
  const activity = createBuiltInActivity({
    topic: "",
    learnerLevel: "",
    availableMaterials: "",
    failedEquipmentType: "internet-unavailable",
  });

  assert.equal(activity.topic, "today's lesson topic");
  assert.equal(activity.learnerLevel, "your learners");
  assert.equal(isNoEquipmentActivity(activity), true);
});

test("repair confirmation is unavailable before a result and after an incomplete failure", () => {
  const issue = "projector-no-signal";
  const steps = TROUBLESHOOTING_STEPS[issue];

  assert.equal(canConfirmResolution(issue, []), false);
  assert.equal(canConfirmResolution(issue, [check(steps[0].id)]), false);
  assert.equal(
    canConfirmResolution(issue, steps.slice(0, 2).map((step) => check(step.id))),
    false,
  );
});

test("repair confirmation is available after success, escalation, or all checks", () => {
  const issue = "projector-no-signal";
  const steps = TROUBLESHOOTING_STEPS[issue];

  assert.equal(canConfirmResolution(issue, [check(steps[0].id, "working-now")]), true);
  assert.equal(
    canConfirmResolution(issue, [check(steps[0].id, "stop-and-escalate")]),
    true,
  );
  assert.equal(
    canConfirmResolution(issue, steps.map((step) => check(step.id))),
    true,
  );
});
