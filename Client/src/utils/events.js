/**
 * Tiny app-wide event bus so distant components can react to data changes
 * (e.g. a new post created in the sidebar dialog shows up in the feed) without a page reload.
 */
const target = new EventTarget();

export const EVENTS = {
  POST_CREATED: "post:created",
  POST_DELETED: "post:deleted",
  STORY_CREATED: "story:created",
  PROFILE_UPDATED: "profile:updated",
};

export function emit(name, detail) {
  target.dispatchEvent(new CustomEvent(name, { detail }));
}

export function subscribe(name, handler) {
  const listener = (e) => handler(e.detail);
  target.addEventListener(name, listener);
  return () => target.removeEventListener(name, listener);
}
