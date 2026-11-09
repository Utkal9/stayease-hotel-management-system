export type BadgeState = "running" | "checking" | "online" | "offline";

const BADGE_STYLES: Record<BadgeState, { label: string; dot: string; text: string; background: string }> = {
  running: { label: "Running", dot: "bg-emerald-600", text: "text-emerald-900", background: "bg-emerald-50" },
  online: { label: "Connected", dot: "bg-emerald-600", text: "text-emerald-900", background: "bg-emerald-50" },
  checking: { label: "Checking", dot: "bg-amber-500", text: "text-amber-900", background: "bg-amber-50" },
  offline: { label: "Not reachable", dot: "bg-red-600", text: "text-red-900", background: "bg-red-50" },
};

interface StatusBadgeProps {
  state: BadgeState;
}

// The text label carries the meaning; the dot colour only reinforces it.
export default function StatusBadge({ state }: StatusBadgeProps) {
  const style = BADGE_STYLES[state];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${style.background} ${style.text}`}>
      <span className={`size-2 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}
