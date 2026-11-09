import { useApiHealth } from "../hooks/useApiHealth";
import { getHealthUrl } from "../services/healthService";
import StatusBadge from "./StatusBadge";

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function SystemStatusCard() {
  const { health, recheck } = useApiHealth();

  return (
    <section aria-labelledby="system-status-heading" className="rounded-xl bg-white p-6 text-neutral-900 shadow-xl sm:p-8">
      <h2 id="system-status-heading" className="font-display text-2xl font-semibold text-navy-950">
        System status
      </h2>
      <p className="mt-1 text-sm text-neutral-600">Confirms the web app can reach the StayEase API.</p>

      <dl className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        <div className="flex items-center justify-between gap-4 py-4">
          <dt className="font-medium">Web app</dt>
          <dd>
            <StatusBadge state="running" />
          </dd>
        </div>

        <div className="py-4" role="status" aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <dt className="font-medium">API</dt>
            <dd>
              <StatusBadge state={health.state} />
            </dd>
          </div>
          <p className="mt-2 break-all text-sm text-neutral-600">{getHealthUrl()}</p>
          {health.state === "online" && (
            <p className="mt-1 text-sm text-neutral-600">
              {health.service} responded at {formatTime(health.checkedAt)}.
            </p>
          )}
          {health.state === "offline" && (
            <p className="mt-1 text-sm text-red-800">
              {health.reason}. Run <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-neutral-900">npm run dev</code> from
              the repository root, then check again.
            </p>
          )}
        </div>
      </dl>

      <button
        type="button"
        onClick={recheck}
        disabled={health.state === "checking"}
        className="mt-6 inline-flex items-center rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
      >
        Check again
      </button>
    </section>
  );
}
