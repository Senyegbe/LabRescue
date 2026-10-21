export function printSection(
  sectionId: "activity-print" | "handoff-print",
): string {
  const section = document.getElementById(sectionId);
  if (!section) {
    return "The selected print view is not available. You can still read it on screen.";
  }
  if (typeof window.print !== "function") {
    return "Printing is not available in this browser. You can still read this information on screen.";
  }

  document.body.dataset.printTarget = sectionId;
  window.addEventListener(
    "afterprint",
    () => {
      delete document.body.dataset.printTarget;
    },
    { once: true },
  );
  try {
    window.print();
    return "";
  } catch {
    delete document.body.dataset.printTarget;
    return "The browser could not open its print dialog. You can still read this information on screen.";
  }
}
