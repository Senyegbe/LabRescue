# LabRescue

**Every lesson deserves a chance.** LabRescue helps teachers continue a lesson
when classroom equipment fails, record safe first-line checks, prepare a
no-equipment activity, and print a clear technician handoff.

## Run locally

You need Node.js 24 or newer and npm.

1. Open a terminal in this project folder.
2. Install the packages: `npm install`
3. Start the app: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Stop the local server with `Ctrl+C` in the terminal.

In Windows PowerShell, use `npm.cmd` in place of `npm` if script execution
policy prevents the `npm` command from running. Other terminals can use `npm`.

The app works without a Gemini API key. Lesson activities use the built-in
generator unless a teacher explicitly opts in to Gemini after reviewing the
data disclosure. Google&apos;s data handling differs between unpaid and paid
service tiers; see the [Gemini API terms](https://ai.google.dev/gemini-api/terms),
[usage policies](https://ai.google.dev/gemini-api/docs/usage-policies), and
[pricing](https://ai.google.dev/gemini-api/docs/pricing). Use Gemini only in a
teacher-facing context, not for student-facing access, and never send sensitive,
confidential, or personal information.

## Optional Gemini setup

1. Copy `.env.example` to `.env.local`.
2. Add your key to `GEMINI_API_KEY` in `.env.local`.
3. Restart the development server.

Keep `.env.local` private; it is ignored by Git. When a teacher chooses Gemini,
the app sends only the lesson topic, learner level, available materials, and
failed equipment type. It does not send case IDs, names, report notes, or check
history. The app explains Google's applicable data handling before asking for
consent. Gemini activities are validated and rejected if they are incomplete
or require classroom technology; a built-in activity is used if Gemini is
unavailable or returns unsuitable data.

## What the app supports

- Projector shows “No Signal”
- Classroom computer will not start
- Classroom internet is unavailable
- Authored, non-invasive checks with stop-and-contact-a-technician guidance
- Multiple independent cases, case history, and teacher-confirmed resolution
- Built-in spoken activities that do not require classroom equipment
- Printable lesson activities and technician handoffs

LabRescue records teacher observations; it cannot diagnose a physical fault or
confirm a repair. Do not open equipment or handle exposed wiring.

## Demo flow

Use fictional classroom details. Start a projector “No Signal” report, record
the safe checks as still unresolved, create the built-in no-equipment lesson
activity, and review or print the technician handoff. After confirming with
the technician that the repair is complete, mark the case resolved and show it
in case history after reloading the page.

## Privacy and storage

Cases are stored in local storage in the current browser on the current device.
They are not automatically synchronized or backed up, and may be lost if
browser data is cleared. Do not enter student names or other sensitive details
in reports.

## Checks

```text
npm test
npm run lint
npm run build
```

## License

MIT. See [LICENSE](./LICENSE).
