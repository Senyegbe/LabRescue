import type { CheckResult, IssueType } from "./types";

export interface TroubleshootingStep {
  id: string;
  title: string;
  instruction: string;
  stopCondition: string;
}

const safetyReminder =
  "Stop and contact your technician if you notice heat, smoke, liquid, damaged wiring, or anything that feels unsafe. Do not open equipment.";

export const TROUBLESHOOTING_STEPS: Record<IssueType, TroubleshootingStep[]> = {
  "projector-no-signal": [
    {
      id: "projector-input",
      title: "Confirm the selected input",
      instruction:
        "Use the projector's normal controls to check that the selected input matches the cable or connection already in use.",
      stopCondition: safetyReminder,
    },
    {
      id: "projector-connection",
      title: "Check the visible connection",
      instruction:
        "If it is easy to reach, check that the existing external cable is seated at both ends. Do not force it or reach behind heavy furniture.",
      stopCondition:
        "If a cable or port looks damaged, loose, hot, or hard to reach, stop and ask the technician to inspect it.",
    },
    {
      id: "projector-signal",
      title: "Check whether the signal returns",
      instruction:
        "Wait a few seconds after the input and connection check. Note whether the image returns or the “No Signal” message remains.",
      stopCondition:
        "If the message remains, stop troubleshooting here and give the technician the checks you recorded.",
    },
  ],
  "computer-wont-start": [
    {
      id: "computer-power",
      title: "Look for a normal power indicator",
      instruction:
        "Without opening the computer, check whether its usual power light or screen indicator is on.",
      stopCondition: safetyReminder,
    },
    {
      id: "computer-cable",
      title: "Check the accessible power connection",
      instruction:
        "If safe and easy to reach, check that the existing external power cable is seated. Do not pull, force, or touch exposed wiring.",
      stopCondition:
        "If the cable, outlet, or power strip looks damaged or feels warm, stop and contact the technician.",
    },
    {
      id: "computer-retry",
      title: "Try one normal start",
      instruction:
        "Press the computer's usual power button once and observe whether it starts. Do not repeatedly cycle power.",
      stopCondition:
        "If it still does not start, stop here and contact the technician. Do not open the case or attempt internal repairs.",
    },
  ],
  "internet-unavailable": [
    {
      id: "internet-scope",
      title: "Check whether one or many devices are affected",
      instruction:
        "If another classroom device is already available, check whether it can reach a familiar school-approved page.",
      stopCondition:
        "If you do not have another device, skip this check. Do not sign in to network equipment or change its settings.",
    },
    {
      id: "internet-connection",
      title: "Check the device's normal connection indicator",
      instruction:
        "Look at the computer's usual network indicator and note whether it shows connected, disconnected, or an error.",
      stopCondition:
        "If you are asked to change network settings or enter unfamiliar credentials, stop and contact the technician.",
    },
    {
      id: "internet-retry",
      title: "Retry one familiar page",
      instruction:
        "Reload one school-approved page once. Note whether it opens, remains blank, or shows an error.",
      stopCondition:
        "If the connection is still unavailable, stop here and contact the technician. Do not restart network equipment or alter its settings.",
    },
  ],
};

export function canConfirmResolution(
  issueType: IssueType,
  checkResults: CheckResult[],
): boolean {
  return (
    checkResults.some(
      (result) =>
        result.outcome === "working-now" ||
        result.outcome === "stop-and-escalate",
    ) ||
    TROUBLESHOOTING_STEPS[issueType].every((step) =>
      checkResults.some((result) => result.stepId === step.id),
    )
  );
}

export { safetyReminder };
