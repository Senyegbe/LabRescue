---
doc: prd
status: approved
---

# LabRescue — Product Requirements

LabRescue helps teachers continue lessons during classroom-equipment failures and prepare clear technician handoffs.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey

1. The teacher opens the dashboard. A first-time teacher sees a clear “Report a problem” action and a reassuring empty state. Returning teachers see all open cases, their urgency and status, and access to resolved case history.
2. The teacher reports a problem by selecting a device, describing the fault, identifying the affected lesson activity, and choosing urgency. Notes are optional. The report becomes a new open case.
3. The teacher opens that case and follows its authored, safe troubleshooting checks one case at a time, recording the outcome of each step. If the equipment is still not working, LabRescue offers “Keep my lesson going.”
4. The teacher requests a fallback activity and provides the topic, learner level, and available materials in a short form. Any useful report details may be prefilled and remain editable; the teacher can proceed with minimal details.
5. LabRescue presents a practical activity that does not rely on the failed equipment, with clear instructions and a suggested duration. The teacher can save it to the case, view it again, print it, or reuse it later.
6. The teacher can print a technician handoff that summarizes the device, reported symptoms, checks and outcomes, current status, and what remains unresolved.
7. After the technician informs the teacher that the device is fixed, the teacher confirms the outcome and marks the case resolved. If the problem persists or the teacher has not confirmed the repair, the case remains open. Its history stays available.

Sources: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

## Screens and Layout

- **Dashboard:** Show the LabRescue identity and “Report a problem” action. The first-visit empty state uses the headline and reassurance in **Look and Feel**. When cases exist, show every unresolved case with a clear status, urgency, and next step. Keep resolved cases and past case details available as history.
- **Report form:** Collect device, symptom, affected lesson activity, and urgency; provide an optional notes field. The supported issues are projector no signal, computer will not start, and internet unavailable.
- **Case and troubleshooting view:** Keep each report independent, show its status and history, and guide only one case through checks at a time. Record the outcome of each check and make stop/escalate guidance visible.
- **Fallback activity flow:** After unresolved troubleshooting, present “Keep my lesson going,” then a short form for topic, learner level, and available materials. Show the resulting activity with its instructions and duration, attached to the case.
- **Technician handoff:** Provide a clear printable report; it is a handoff for the teacher to give the technician, not a shared technician account or remote status system.

Sources: `scope.md > The Core Loop`, `scope.md > The POC Boundary`, `scope.md > Explicitly Cut`.

## Look and Feel

The app should feel warm, natural, caring, and professional, with accessible text, clear navigation, and thoughtful illustrations where useful. The emotional center is that technology can fail without the lesson having to fail.

**Identity:** LabRescue — “Classroom continuity & repair.”

> YOUR CLASSROOM SUPPORT\
> # Every lesson deserves a chance.\
> When technology lets you down, we're here to help you find the next step.\
> **Report a problem**\
> ### Keep the learning going.\
> We'll help you try safe checks, prepare a backup activity, and explain the problem to a technician if needed.\
> One problem at a time. One lesson at a time.

“One problem at a time” describes the guided troubleshooting experience; it does not limit how many open cases a teacher can report.

## Features and Behavior

### Dashboard and Case History

Based on `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

- Show all unresolved cases, including each case's status and urgency. A teacher can open any case and continue its next step without being forced to finish another case first.
- Allow multiple independent cases at once. Each has its own check history, saved fallback activity, and technician handoff.
- Keep resolved cases available in case history.
- On first use, show: “Every lesson deserves a chance,” the supporting message above, and a clear “Report a problem” action.

- [ ] A new teacher sees the first-visit message and can start a report immediately.
- [ ] A teacher can create a second open case while another remains unresolved; both appear on the dashboard with their own status and urgency.
- [ ] A resolved case no longer appears among unresolved cases but remains accessible in history.

### Reporting a Problem

Based on `scope.md > The Core Loop` and `scope.md > The POC Boundary`.

- Create reports for only three predefined issues: projector shows no signal, computer will not start, and internet is unavailable.
- Collect device, symptom, affected lesson activity, and urgency; allow optional notes.
- Save each submitted report as an independent open case.

- [ ] A teacher can submit a report for each of the three supported issues and see the new open case.
- [ ] Optional notes may be left blank without preventing a report.

### Safe Troubleshooting

Based on `scope.md > The Unique Kernel` and `scope.md > The POC Boundary`.

- Guide the teacher through authored checks for the selected issue, one case at a time.
- Record the teacher's outcome for each check and show clear stop/escalate conditions.
- Never use AI to invent or alter repair steps, and do not claim to confirm a physical fault.

- [ ] Each supported issue follows its own predefined sequence of checks.
- [ ] A teacher can record check outcomes and later see what was tried in that case's history and handoff.
- [ ] When a stop/escalate condition applies, it is visible and the flow does not ask the teacher to continue that check sequence.

### Keep the Lesson Going

Based on `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`, and `scope.md > The POC Boundary`.

- After troubleshooting leaves the equipment unusable, offer a prominent “Keep my lesson going” action.
- Ask for the lesson topic, learner level, and available materials only when the teacher requests a fallback, keeping the initial problem report quick.
- Prefill useful information already supplied, let the teacher edit it, and allow them to continue with minimal details.
- Generate a practical activity that does not depend on the failed equipment. Include clear instructions and a suggested duration, and save it to the case so it can be viewed, printed, or reused.
- Keep AI disabled by default. Before the first Gemini request, explain the exact generic fields that will be sent and the relevant data handling; let the teacher opt in, and make the built-in generator easy to choose instead.
- Validate the structure and required content of any AI-generated activity. If the response is empty, malformed, unavailable, or unusable, provide a deterministic fallback. Make clear that AI may be wrong.

- [ ] The teacher can request a fallback after unresolved troubleshooting and provide or edit the three lesson details.
- [ ] The displayed activity uses the supplied details, avoids the failed equipment, and includes instructions and a duration.
- [ ] The activity remains available from its case after leaving the screen.
- [ ] AI is off until the teacher opts in after seeing what would be sent; the built-in generator remains an easy alternative.
- [ ] An unavailable, empty, malformed, or unusable AI result does not leave the teacher without a fallback, and no activity depends on the failed equipment.

### Technician Handoff and Resolution

Based on `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`, and `scope.md > The POC Boundary`.

- Produce a printable handoff with the reported issue, checks tried and their outcomes, current status, and what remains unresolved.
- The teacher gives the handoff to the technician. There are no technician accounts, remote status updates, or cloud synchronization in this version.
- The teacher marks a case resolved only after confirming with the technician that the problem is fixed. If not confirmed or still unresolved, it stays open.

- [ ] The printable handoff contains enough information to communicate the problem and checks already attempted.
- [ ] A teacher can keep an unresolved case open or mark it resolved after confirmation.
- [ ] Marking a case resolved updates the dashboard while preserving its history.

## States and Boundaries

- **First use:** No cases exist yet. Show the reassuring empty state and the “Report a problem” action.
- **Open cases:** Multiple may exist. Show status and urgency, and allow the teacher to continue one case at a time.
- **Troubleshooting stop/escalation:** Show a clear stop/escalate instruction. Do not have AI provide repair steps or claim a physical diagnosis.
- **AI unavailable or output unusable:** Use the deterministic fallback rather than showing a blank result or claiming generation succeeded.
- **AI consent:** AI is disabled by default. Before the first Gemini request, tell the teacher exactly which generic fields will be sent and summarize the applicable data policy. The teacher can choose the deterministic generator instead.
- **Persistence:** Keep reports, check outcomes, activities, and statuses on the current device in the current browser. Explain that they are not automatically synchronized or backed up and may be deleted if browser data is cleared.
- **Resolution:** A technician does not update the app remotely. The teacher changes status after confirming the repair; otherwise the case remains open.
- **Save failure:** Do not tell the teacher a report or activity was saved unless it was successfully stored.

Sources: `scope.md > The POC Boundary`, `scope.md > Explicitly Cut`.

## Product Decisions

- Keep lessons going before treating equipment failure as only a repair ticket; this is the product's distinguishing idea. (`scope.md > The Unique Kernel`)
- Support exactly three predefined failure scenarios in the proof of concept. (`scope.md > The POC Boundary`)
- Use authored troubleshooting checks; AI is limited to lesson fallback generation and must not invent repair steps. (`scope.md > The POC Boundary`)
- Allow multiple open cases but guide only one case's checks at a time. Keep “One problem at a time” as reassuring language, not a reporting limit.
- Ask for lesson details when a fallback is requested, not during the initial report; prefill and allow editing, with a minimal-details path.
- Keep Gemini disabled until explicit teacher opt-in, disclose the limited data sent, and validate its output before use.
- Keep records in the teacher's browser. The teacher, not the technician, updates case status after confirming a repair.
- Keep the proof of concept responsive, caring, and professional. The challenge submission needs a public repository with the MIT License and a short demo video. (`scope.md > What "Working" Looks Like`)

## What We're Building

A complete responsive teacher-facing web app with the dashboard, report flow, three safe troubleshooting paths, lesson fallback flow, case history and status management, and printable technician handoff. Demonstrate the full projector “No Signal” journey from initial report through lesson alternative and handoff.

## Deferred From the POC

- Shared technician access, remote status updates, accounts, and cloud synchronization: a printable handoff and teacher-confirmed status are simpler and match browser-local records.
- Database or broader deployment: consider only if the core flow is stable and time remains.

## Possible Later Enhancements

Schools may need a shared workflow with technician access and synchronized case updates. Additional deployment or a database can be considered after the classroom-continuity flow is proven.

## Non-Goals

- Native mobile app, computer vision, hardware sensors, or automated remote diagnosis: they do not prove the core idea and could imply the app can verify a physical fault.
- School-wide accounts, WhatsApp bot, full offline sync, payment system, parts marketplace, or large knowledge base: these are outside the small, local-browser proof of concept.
- AI-generated repair instructions or claims that AI has confirmed a physical fault: safety and trust require authored checks and an honest handoff.

Source: `scope.md > Explicitly Cut`.

## Open Questions

No blocking product questions remain. Use Low/Medium/High urgency labels as the implementation default; review the exact authored check wording during implementation to ensure it stays within the safety boundary.
