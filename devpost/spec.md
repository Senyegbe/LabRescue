---
doc: spec
status: approved
---

# LabRescue — Technical Spec

## How This Works, In Plain Language

LabRescue is one small web app. Next.js serves the pages and a private server route for the optional Gemini request. The teacher's cases stay in the browser's local storage on the current device. They are not automatically synchronized or backed up, and clearing browser data may delete them. No database or account is needed.

When a teacher asks for a backup activity, LabRescue can make one itself from a built-in template. AI is disabled unless the teacher opts in after seeing what information will be sent. If they opt in and a server-side API key is configured, the app sends only the approved lesson details and failed equipment type to Google, checks the result, and saves a valid activity to the local case. If the teacher declines, the key is missing, or the request fails, the built-in activity still works.

The checks for failed equipment are written and reviewed by us in the project. Gemini never writes or changes troubleshooting steps. This keeps the safety-critical path predictable while keeping the application usable without an external service.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The browser opens `app/page.tsx`; `LabRescueApp` reads saved cases from local storage and shows the dashboard.
2. The teacher submits the report form. The app creates a case and saves it through `lib/case-storage.ts`; the dashboard now shows it as open.
3. The teacher opens one case. `lib/troubleshooting.ts` supplies its authored steps, and the case workspace saves each reported outcome with that case.
4. If the fault remains, the teacher requests a backup lesson. The app builds a deterministic activity locally unless the teacher explicitly enables Gemini and a key is configured.
5. For an opted-in Gemini request, the browser sends only the topic, learner level, available materials, and failed equipment type to `app/api/fallback/route.ts`. That server route calls Google's API, validates its response, and returns the activity. The browser saves the activity to that case.
6. The case workspace displays the activity and creates a printable technician handoff from the saved case data. No case record is sent to Google.
7. After speaking with the technician, the teacher marks the case resolved. The app updates local storage and keeps the case in history.

## Stack

- **Node.js 24 LTS and npm.** The current Next.js documentation requires Node.js 20.9 or newer; Node 24 is an active LTS release. [Node.js releases](https://nodejs.org/en/about/previous-releases), [Next.js installation](https://nextjs.org/docs/app/getting-started/installation).
- **Next.js App Router with React and TypeScript.** This proof of concept uses one responsive app and a server-side route. The App Router keeps the pages and the private Gemini route in one project. Use the current `create-next-app` defaults and commit the generated `package-lock.json` so the installed versions stay reproducible. [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [React](https://react.dev/learn), [TypeScript](https://www.typescriptlang.org/docs/).
- **Tailwind CSS.** Use the styling setup included by the current Next.js scaffold for responsive layouts and the warm visual direction, rather than adding a component library. [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
- **Zod.** Validate Gemini output and stored case data before using them. It is a small, dependency-free TypeScript validation library; it does not replace the deterministic fallback. [Zod](https://zod.dev/).
- **Built-in browser and Node APIs.** Use `localStorage`, browser printing, and `fetch`; no separate database, state-management package, Gemini client SDK, or UI component package is needed.

Tradeoff: Next.js has more setup than a plain static page, but it keeps the browser interface and the key-protecting server route together. Node 24 LTS satisfies Next.js's documented minimum and the current Google Gen AI JavaScript SDK requirement if an SDK is needed later; this MVP uses server-side `fetch` to avoid that extra package.

## Where It Runs and How Someone Tries It

- **Development:** Run on the teacher's computer in a modern browser. Install the current Node.js LTS release and npm, then run `npm install` and `npm run dev` in the project folder. Open `http://localhost:3000`.
- **Gemini:** Optional and disabled by default. Before the first request, explain what generic fields will be sent and the applicable data handling; the teacher must opt in and can choose the built-in generator instead. Use Gemini only in a teacher-facing context, not for student-facing access, and do not send sensitive, confidential, or personal information. Without a key, the app still creates deterministic fallback activities. To enable Gemini, put `GEMINI_API_KEY` in the ignored local `.env.local` file and restart the development server. Never use a `NEXT_PUBLIC_` variable for a secret. `.env.example` contains only a placeholder.
- **Verification:** Run `npm test`, `npm run lint`, and `npm run build`. Manually exercise all three equipment scenarios, multiple cases, case persistence after reload, print layout, the no-key fallback, Gemini opt-in, and Gemini failure/invalid-output fallback.
- **Demo:** Record the projector “No Signal” journey locally, including a safe check that did not resolve the issue, the fallback activity, printable handoff, and teacher-confirmed resolution. A public GitHub repository and short demo video are required; hosting is optional and does not replace the video. The app has since been deployed to Vercel separately from the MVP build.
- **License:** Include the approved MIT License before publishing the repository.

## Look and Feel

Implement `prd.md > Look and Feel`: warm, natural colors; caring but professional copy; accessible text; clear navigation; and a responsive layout. Use illustrations only where they clarify or add warmth, preferably as lightweight local or inline artwork rather than a new asset dependency. Keep “Every lesson deserves a chance.” prominent on the first-visit dashboard. Maintain readable contrast and visible keyboard focus.

## Components

### `LabRescueApp`

Coordinates the dashboard, report flow, selected case, activity flow, and case updates. Loads local storage after the page opens to avoid server/browser rendering mismatches. The dashboard explains that records belong to this browser and device, are not synchronized or backed up, and may be lost if browser data is cleared.
Implements `prd.md > The Core Journey`, `prd.md > Dashboard and Case History`.

### `Dashboard`

Shows the first-visit message, report action, all unresolved cases with status and urgency, and access to resolved history. Allows a teacher to choose which case to continue without merging cases.
Implements `prd.md > Dashboard and Case History`.

### `ReportForm`

Captures one of the three supported issues, device, symptom, affected lesson activity, urgency, and optional notes; creates a new open case after validation.
Implements `prd.md > Reporting a Problem`.

### `CaseWorkspace`

Shows one case at a time, its status, check history, next action, saved activity, and handoff action. Allows the teacher to mark a case resolved after confirming the repair.
Implements `prd.md > Safe Troubleshooting`, `prd.md > Technician Handoff and Resolution`.

### `TroubleshootingGuide`

Displays fixed, authored checks for projector no signal, computer will not start, or internet unavailable. Captures each outcome and presents explicit stop/escalate conditions. It has no Gemini dependency.
Implements `prd.md > Safe Troubleshooting`.

### `FallbackActivityForm` and `FallbackActivity`

Collects or prefills topic, learner level, and materials only when requested; keeps the values editable and permits minimal details. Displays, saves, prints, and allows later reuse of the resulting activity.
Implements `prd.md > Keep the Lesson Going`.

### `TechnicianHandoff`

Formats the issue, urgency, lesson impact, check outcomes, status, and unresolved details for browser printing. It does not provide technician login or remote updates.
Implements `prd.md > Technician Handoff and Resolution`.

### `app/api/fallback/route.ts`

Validates an opted-in request. If `GEMINI_API_KEY` exists, calls Gemini with only the permitted generic fields and returns a schema-validated, non-empty activity that does not require the failed equipment. If the key is missing or the request/output is invalid, the browser uses the local deterministic generator instead. The route never receives case IDs, teacher names, free-text case notes, or troubleshooting history.
Implements `prd.md > Keep the Lesson Going`, `prd.md > States and Boundaries`.

### `lib/case-storage.ts`

Reads, validates, updates, and writes the versioned case collection in browser local storage. Reports a storage error rather than showing a success state when a write fails.
Implements `prd.md > Dashboard and Case History`, `prd.md > States and Boundaries`.

## Data Model

Keep all teacher case records in the browser. One versioned local-storage entry contains an array of cases:

- **Case:** id, supported scenario/device, symptom, affected lesson activity, urgency, optional notes, open/resolved status, created/updated timestamps, troubleshooting entries, and optional saved fallback activity.
- **Troubleshooting entry:** authored step id, teacher-recorded outcome, and timestamp. The printable handoff looks up the authored step text from the selected scenario.
- **Fallback activity:** topic, learner level, available materials, failed equipment type, title, suggested duration, instructions, materials, and whether it came from Gemini or the deterministic template.
- **Status:** `open` or `resolved`. The teacher changes it; no technician or remote service writes it.

Read records from the browser after hydration to avoid server/browser rendering mismatches, validate parsed data, and write each successful change back to local storage. Reloading the same site in the same browser restores the cases. Another browser/device does not share them. Do not silently erase unreadable or unsaved records.

For an AI request, send only `topic`, `learnerLevel`, `availableMaterials`, and `failedEquipmentType` after the teacher opts in. Do not send case ids, report notes, names, check history, or the local case collection. Only a validated activity returns to the browser, where the teacher can save it in the case.

## File Structure

```text
LabRescue/
├── app/
│   ├── api/
│   │   └── fallback/
│   │       └── route.ts             # Optional, server-only Gemini request
│   ├── globals.css                  # Tailwind import and global styles
│   ├── icon.svg                     # LabRescue app icon
│   ├── layout.tsx                   # App shell and document metadata
│   └── page.tsx                     # Single-page app entry
├── components/
│   ├── LabRescueApp.tsx             # Main browser-side flow and local state
│   ├── Dashboard.tsx                # Open/resolved case overview
│   ├── ReportForm.tsx               # New problem form
│   ├── CaseWorkspace.tsx            # One case's workflow
│   ├── TroubleshootingGuide.tsx     # Authored checks and recorded outcomes
│   ├── FallbackActivityForm.tsx     # Optional lesson-detail inputs
│   ├── FallbackActivity.tsx         # View/print saved activity
│   └── TechnicianHandoff.tsx        # Printable repair summary
├── lib/
│   ├── types.ts                     # Shared case, check, and activity types
│   ├── validation.ts                # Zod schemas for inputs and saved data
│   ├── case-storage.ts              # Versioned browser-local persistence
│   ├── troubleshooting.ts           # Fixed decision trees for three scenarios
│   ├── fallback-activity.ts         # Deterministic no-key activity generator
│   └── print.ts                     # Print-specific helpers, if needed
├── devpost/
│   ├── learner-profile.md           # Private; ignored by Git
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── scope.md                         # Root copy of the approved scope
├── prd.md                           # Root copy of the approved PRD
├── spec.md                          # Root copy of the approved technical spec
├── .env.example                     # Placeholder only; safe to publish
├── .gitignore                       # Ignores learner profile and secrets
├── LICENSE                          # MIT License; include before public release
├── README.md                        # Setup, usage, privacy, and demo notes
├── package.json
├── package-lock.json
├── tsconfig.json
└── next.config.ts                   # Generated by the Next.js scaffold
```

## External Services and Dependencies

### Gemini Developer API (optional)

- **Service:** [Gemini Developer API](https://ai.google.dev/gemini-api/docs); the app is configured to call [`gemini-3.6-flash`](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash). Check the [model guide](https://ai.google.dev/gemini-api/docs/models) for current availability before enabling it.
- **Call:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent` from `app/api/fallback/route.ts`, only after the teacher opts in and only when `GEMINI_API_KEY` is configured.
- **Authentication:** Server-side `x-goog-api-key` header from `GEMINI_API_KEY`. Never place the key in browser code, responses, logs, `.env.example`, or Git history. Keep `.env.local` ignored.
- **Request:** JSON with `contents` containing a prompt built only from the four allowed fields, and `generationConfig` requesting `application/json`. The route validates title, duration, instructions, and materials with Zod after parsing the response; it does not send a response schema. Do not include case notes or report history.
- **Response:** Read the text from the first candidate's content parts, parse the JSON, and validate it with Zod before returning it to the browser. Reject empty or malformed output and any activity that requires the failed equipment; invalid, blocked, timed-out, unavailable, or rate-limited responses use the deterministic activity instead.
- **Cost and data:** Google states that unpaid service content may be used to improve products, may be reviewed by humans, and is retained for up to 55 days for abuse monitoring. Paid services do not use prompts and responses to improve products, but may log them for a limited period for safety and legal purposes. Access and pricing depend on model and service tier; do not promise free use. Google's terms prohibit making Gemini API available through apps directed to or likely accessed by people under 18. Check the current [terms](https://ai.google.dev/gemini-api/terms), [pricing](https://ai.google.dev/gemini-api/docs/pricing), [API key guidance](https://ai.google.dev/gemini-api/docs/api-key), [usage policies](https://ai.google.dev/gemini-api/docs/usage-policies), and [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) before enabling Gemini. Never send sensitive, confidential, or personal information.
- **Limits:** Exact quotas depend on the Google project, model, and usage tier. Check current limits in [AI Studio](https://aistudio.google.com/rate-limit); any limit or service error must leave the local deterministic flow usable.

### Local development

- **Next.js:** Current scaffold and routing guides: [installation](https://nextjs.org/docs/app/getting-started/installation), [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers), [create-next-app options](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
- **Tailwind CSS:** [Next.js setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
- **Zod:** [Documentation](https://zod.dev/).
- No database, hosting provider, authentication service, or external image service is required.

## Important Failure Modes

- **No Gemini key or teacher does not opt in** → generate and save the built-in activity locally; show no API error.
- **Gemini request fails, is limited, empty, malformed, or depends on the failed equipment** → explain briefly that AI could not be used and show the deterministic activity.
- **Local storage is unavailable, malformed, or cannot be written** → explain that case data is local to this browser/device, is not synchronized or backed up, and may be deleted if browser data is cleared. Show an honest recovery/error message; never claim unsaved work was saved or silently replace existing records.
- **Browser print is unavailable or layouts overflow on small screens** → keep on-screen handoff/activity readable and test print and mobile layouts before the demo.

## Sharing and Deployment

- **Public GitHub repository:** [https://github.com/Senyegbe/LabRescue](https://github.com/Senyegbe/LabRescue)
- **Live deployment:** [https://lab-rescue.vercel.app](https://lab-rescue.vercel.app) (opened successfully during this compliance review).
- **Demo video:** No video URL is recorded in the project files available for this review. A publicly accessible short demo video remains required for submission; a live deployment does not replace it.

## What Was Simplified and Why

- **One local browser collection** instead of accounts, a cloud database, or cross-device sync/backups — keeps setup short and matches the teacher-managed case flow.
- **Three authored decision trees** instead of an AI diagnosis or a general repair knowledge base — keeps first-line guidance bounded and predictable.
- **Local deterministic fallback** instead of making Gemini required — the core lesson-continuity feature works without a key, internet access, quota, or paid plan.
- **One local responsive app** instead of a deployment-dependent product — keeps hosting optional. A Vercel deployment was completed after the MVP build and does not change the local-browser data model.

## Decisions and Open Issues

### Learner-approved decisions

- Next.js App Router, TypeScript, and Tailwind CSS; Gemini server-side only; local browser storage; no database or accounts.
- The app must remain fully usable without a Gemini key, and the teacher explicitly controls whether generic lesson details are sent to Gemini.
- Only topic, learner level, available materials, and failed equipment type may be sent; names, notes, ids, and troubleshooting history may not.
- Use authored safety checks, no AI repair instructions, and a deterministic activity when Gemini is absent or fails.
- Explain browser/device-only storage, lack of automatic sync or backup, and the possibility of loss if browser data is cleared.
- Keep setup and dependencies lean; hosting is optional and does not add accounts, cloud case storage, or synchronization to the MVP. The app was deployed to Vercel after the local build.
- Use the MIT License and add it before making the GitHub repository public.

### Implementation details derived from those decisions

- Use the current stable scaffold defaults, a versioned browser-local data shape, and one internal route for the optional AI call.
- Default to the deterministic fallback. Offer Gemini only with an explicit teacher action and a clear disclosure of the applicable Google data policy.
- Use simple urgency options (Low, Medium, High) unless implementation reveals a concrete usability issue; these labels are a build default, not a previously stated learner preference.
- Use short, non-invasive checks with visible stop/escalate instructions. Do not instruct the teacher to open equipment, handle exposed wiring, or attempt a repair.

### Decisions and open issues

- Explain unfamiliar tools and commands before asking the learner to approve them; confirm consequential technical choices before implementation.
- The detailed wording of each authored troubleshooting step should be checked against the PRD's safety boundary during implementation.
