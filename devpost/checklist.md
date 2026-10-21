---
doc: checklist
status: approved
---

# Build Checklist

Build mode: Learn mode for this resumed review. The original build-mode choice cannot be recovered from the available project history.

This is a retrospective record created after implementation. The order below is the approved, dependency-aware proposed build order, not verified historical build chronology. The app is present in a single consolidated source commit; available Git history does not show separate commits for the behavior slices below. The runtime journey remains report, safe checks, fallback after unresolved checks, then technician handoff and confirmed resolution. A project owner later reported hands-on results for the main journey, but these do not establish historical slice boundaries or commits. All slice boxes remain unchecked because the required per-slice commit evidence is absent. This document does not claim that the installed skill was run during development.

## Slices

- [ ] **1. Report a classroom problem and return to saved cases**
  Becomes usable: A teacher can create an independent report for one of the three supported classroom-equipment issues and find it again from the dashboard.
  Why now: A saved case is the entry point for the safe-check and lesson-continuity journey.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Dashboard and Case History`, `prd.md > Reporting a Problem`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`, `spec.md > File Structure`
  Build: Existing implementation in `components/ReportForm.tsx`, `components/LabRescueApp.tsx`, `components/Dashboard.tsx`, and `lib/case-storage.ts`.
  Verify (mechanical): `npm.cmd run lint` passed (exit 0); the final `npm.cmd run build` passed (exit 0). These results do not create a historical per-slice commit.
  Learner check: A retrospective owner check reported that creating a fictional classroom problem, finding it on the dashboard, reloading, and reopening the saved case worked. This is not evidence of an early-build checkpoint.
  Commit: Existing consolidated source commit; no separate slice commit is evidenced.

- [ ] **2. Record safe troubleshooting checks and outcomes**
  Becomes usable: A teacher can follow authored safe checks for a reported case, record each outcome, and see whether to continue or stop and escalate.
  Why now: The fallback must depend on a real, case-specific unresolved outcome; the app must not skip the safety checks that establish it.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Safe Troubleshooting`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Components`, `spec.md > Data Model`
  Build: Existing implementation in `lib/troubleshooting.ts`, `components/TroubleshootingGuide.tsx`, and `components/CaseWorkspace.tsx`.
  Verify (mechanical): `npm.cmd test` passed (6 tests, 0 failures; Node emitted a module-type warning); `npm.cmd run lint` passed (exit 0); the final `npm.cmd run build` passed (exit 0). The owner separately reported the unresolved outcomes displayed correctly.
  Learner check: A retrospective owner check reported that the safe-check instructions and three unresolved outcomes displayed correctly. This is not evidence of an early-build checkpoint.
  Commit: No per-slice commit is evidenced in available history; no new commit is authorized.

- [ ] **3. Generate a fallback after unresolved checks, prepare the handoff, and confirm resolution**
  Becomes usable: After unresolved checks, a teacher can save and print a built-in activity that avoids failed equipment, prepare a handoff with the case details, and mark the case resolved only after confirming the technician fixed it.
  Why now: This completes the lesson-continuity kernel in runtime order: fallback first, then technician handoff and confirmed resolution. Optional Gemini does not block the built-in activity.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Keep the Lesson Going`, `prd.md > Technician Handoff and Resolution`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > External Services and Dependencies`, `spec.md > Important Failure Modes`
  Build: Existing implementation in `components/FallbackActivityForm.tsx`, `components/FallbackActivity.tsx`, `lib/fallback-activity.ts`, `app/api/fallback/route.ts`, and `components/TechnicianHandoff.tsx`.
  Verify (mechanical): `npm.cmd test` passed (6 tests, 0 failures; Node emitted a module-type warning); `npm.cmd run lint` passed (exit 0); the final `npm.cmd run build` passed (exit 0). The owner separately reported fallback and handoff availability after reopening and persisted repair confirmation. Local API probes returned 403 without consent and 503 with consent but no Gemini key.
  Learner check: A retrospective owner check reported that fallback generation and the technician handoff remained available after reopening, and that repair confirmation changed the case to resolved and persisted. This is not evidence of an early-build checkpoint.
  Commit: No per-slice commit is evidenced in available history; no new commit is authorized.

## Hands-on Checkpoints

- [ ] Early usable behavior explored — not evidenced during the original build; the later Slice 1 owner check occurred retrospectively and did not shape implementation.
- [ ] Final kick-the-tires exploration and feedback completed — the owner reported testing the main workflow; broader free exploration and awkward-input checks are not evidenced.

## Final Review

- [x] Record the owner-requested copy change from “Classroom continuity & repair triage” to “Classroom continuity & repair” as a committed revision. The app and PRD copies are updated, the owner confirmed the wording, and the checks passed; this replacement history records the change.
- [ ] Final review complete — the owner reports that the app works well; broader kick-the-tires review and explicit readiness confirmation remain outstanding.

## Code Tour and App Map

- [ ] Learning activity complete — not yet conducted.
- [ ] Optional edit and transfer reflection addressed — not yet offered.
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown — map is prepared as a reference, but a guided tour is still outstanding.

Activity and evidence: `npm.cmd test` passed (6 tests, 0 failures, with one non-fatal Node module-type warning), `npm.cmd run lint` passed, `npm.cmd run build` passed, and `git diff --check` passed after the latest copy revision. An agent-run local production browser check used fictional data to create a projector “No Signal” case, record all three checks as unresolved, save the built-in fallback without AI consent, verify the handoff, confirm repair, reload, and find the case in history. The test record was cleared from the initially empty browser origin afterward. Separate API probes returned 403 without consent and 503 with consent but no Gemini key; the route returns understandable errors directing the teacher to use the built-in activity. A 375px viewport check found no horizontal overflow. These checks do not replace learner review, and they do not establish per-slice historical commits. The learner's reported observations remain recorded in the slice entries.
Route and stops: Reference-only route in `app-map.html`: `components/ReportForm.tsx` submit handler → `components/LabRescueApp.tsx` case creation → `lib/case-storage.ts` persistence and `components/Dashboard.tsx` display. The project owner has not completed this route in a guided tour.
Edit outcome: Not offered.
Reflection: Not offered; no personal learning answer is recorded here.
Activity mode: Static reference map prepared from current source; not yet used in a guided tour.

## Revisions

- The app and approved planning docs predate installation of the skill pack. Available history shows one consolidated app commit, not the skill's ordered per-slice build commits; this checklist records that limitation instead of manufacturing historical checkpoints.
- The dependency-aware proposed order of report, safe-check outcomes, then fallback with handoff and confirmed resolution was approved. This is not evidence of the historical implementation order; available Git history cannot establish that chronology.
- The live Vercel deployment was completed separately after the MVP build. Hosting remains optional and does not change the approved local-browser case storage or scope.
- This review found that a case with unresolved checks had no later repair-confirmation action. The action is now available after a successful check, a safety stop, or completion of all checks; the teacher must still confirm the repair with the technician.
- Current planning copies no longer include personal research context. The replacement branch excludes the earlier public commit; replacing public `master` remains pending separate approval, and old commit objects may remain accessible elsewhere.
- Owner feedback reports that the app works well and requests removing “triage” from the product descriptor. The requested wording is updated in both app brand locations and both PRD copies, and the owner confirmed it; the local revision remains uncommitted pending owner authorization.
