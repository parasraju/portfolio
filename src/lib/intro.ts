export const INTRO_PENDING_CLASS = "intro-pending";
export const INTRO_ENTERED_EVENT = "intro:entered";
export const INTRO_SESSION_KEY = "paras:entered";

export function isIntroPending() {
  return typeof document !== "undefined" && document.documentElement.classList.contains(INTRO_PENDING_CLASS);
}

export function whenIntroDone(callback: () => void): () => void {
  if (!isIntroPending()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener(INTRO_ENTERED_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_ENTERED_EVENT, handler);
}

export function markIntroEntered() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {}
  document.documentElement.classList.remove(INTRO_PENDING_CLASS);
  window.dispatchEvent(new Event(INTRO_ENTERED_EVENT));
}
