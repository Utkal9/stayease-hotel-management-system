import { useCallback, useEffect, useState } from "react";
import { fetchHealth } from "../services/healthService";

export type ApiHealthState =
  | { state: "checking" }
  | { state: "online"; service: string; checkedAt: Date }
  | { state: "offline"; reason: string; checkedAt: Date };

const REQUEST_TIMEOUT_MS = 5000;

export function useApiHealth() {
  const [health, setHealth] = useState<ApiHealthState>({ state: "checking" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]);

    setHealth({ state: "checking" });
    fetchHealth(signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setHealth({ state: "online", service: data.service, checkedAt: new Date() });
      })
      .catch((error: unknown) => {
        // Ignore the abort caused by unmounting or re-checking; a timeout still counts as offline.
        if (controller.signal.aborted) return;
        const reason = error instanceof Error && error.name !== "TimeoutError" ? error.message : "The API did not respond in time";
        setHealth({ state: "offline", reason, checkedAt: new Date() });
      });

    return () => controller.abort();
  }, [attempt]);

  const recheck = useCallback(() => setAttempt((value) => value + 1), []);

  return { health, recheck };
}
