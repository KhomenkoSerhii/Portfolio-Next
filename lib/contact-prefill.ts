// Lets any CTA on the page drop a topic into the contact form's message field.
// The link keeps its `href="#contact"` (so the browser still smooth-scrolls),
// and additionally fires this event; the Contact form listens and prefills.

export const CONTACT_PREFILL_EVENT = "contact:prefill";

export function prefillContact(topic: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string>(CONTACT_PREFILL_EVENT, { detail: topic })
  );
}
