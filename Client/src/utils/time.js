import moment from "moment";

/** Compact relative time: "now", "5m", "3h", "2d", "1mo", "1y". */
export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const s = Math.max(0, Math.floor(diff / 1000));
  if (s < 45) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;
  return `${Math.floor(d / 365)}y`;
}

/** Full relative time, e.g. "3 hours ago". */
export function fromNow(date) {
  return moment(date).fromNow();
}

/** "HH:mm" in local time. */
export function clockTime(date) {
  return moment(date).format("HH:mm");
}
