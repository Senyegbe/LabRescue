---
doc: scope
status: approved
---

# LabRescue

LabRescue helps a teacher keep a lesson going when classroom equipment fails, then gives a technician a clear repair handoff.

## The Unique Kernel
Instead of treating equipment failure as only a repair ticket, LabRescue helps the teacher continue the lesson first: safe, bounded checks; an alternative activity using available materials; and a record a technician can act on.

## Who It's For
A teacher preparing to teach with classroom technology when a device fails. They need to decide what to do next without losing the lesson, and to pass useful details to a technician.

## The Core Loop
The teacher reports a problem, follows authored safe checks and records their outcomes, gets a no-equipment lesson alternative, and saves a case that can be handed to a technician and marked resolved.

## Inspiration & Identity
The product should feel warm, natural, caring, and professional, with accessible
text and clear navigation. Its emotional center is that technology can fail
without the lesson having to fail. The dashboard headline is “Every lesson
deserves a chance.”

## Why This Matters
The need statement is based on desk research only. Classroom equipment failures can interrupt instruction; LabRescue is intended to help teachers keep learning moving while seeking technical support. No teacher testing or school endorsement is established.

## What "Working" Looks Like
In the main demo, a teacher selects a projector showing “No Signal,” follows the safe cable/input checks, and records that they did not fix it. LabRescue then presents a short lesson alternative that does not need a projector and creates a technician handoff with the symptom, checks tried, and status. After confirming the repair with the technician, the teacher can mark the case resolved. The finished challenge submission also needs a short public demo video and public GitHub repository.

## The POC Boundary
Build one complete responsive web-app flow, with a dashboard and “Report a problem” action. Cover only three predefined cases: projector shows no signal, computer will not start, and internet is unavailable. Keep checks in authored decision trees with clear stop/escalate guidance; do not let AI invent repair steps. Generate a lesson fallback from the topic, learner level, and available materials, with a deterministic fallback if AI is unavailable or returns unusable output. Store cases in the browser, support status changes, and provide a printable technician handoff. Explain that AI may be wrong, records are stored in that browser, and the tool cannot confirm a physical fault.

## Later
Broader shared infrastructure and a database remain outside this proof of concept.
The app has since been deployed to Vercel after the local MVP was built; hosting
is an optional way to try the same browser-based app, not an added product
feature or a replacement for the required demo video.

## Explicitly Cut
- Native mobile app: the proof of concept is a responsive web app.
- Computer vision, hardware sensors, and automated remote diagnosis: they are unnecessary to demonstrate the teacher-led flow, and the tool must not claim to verify physical faults.
- School-wide accounts and full offline sync: they add authentication and synchronization work beyond this local-browser proof of concept.
- WhatsApp bot: it is a separate interface, not needed for the core demo.
- Payment system, parts marketplace, and large knowledge base: these are outside the lesson-continuity proof of concept.
