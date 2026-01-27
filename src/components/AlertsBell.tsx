"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type UserAlertItem = {
  id: number;
  alertId: number;
  courseId: number;
  source: string;
  title: string;
  dueAt: string;
  url?: string | null;
  status: string;
};

type UserAlertsResponse = {
  alerts: UserAlertItem[];
};

function getApiBase(): string {
  const base =
    (process.env.NEXT_PUBLIC_API_URL as string | undefined) ??
    "http://localhost:8000/api/v1";
  return base.replace(/\/$/, "");
}

function getMoodleToken(): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("token");
  if (fromQuery) return fromQuery;
  const dev = process.env.NEXT_PUBLIC_DEV_MOODLE_TOKEN;
  return dev ?? null;
}

function buildAuthHeaders(token: string | null): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["X-Moodle-Token"] = token;
  }
  return headers;
}

export function AlertsBell() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<UserAlertItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getMoodleToken();
  }, []);

  const apiBase = useMemo(() => getApiBase(), []);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token);

      try {
        await fetch(`${apiBase}/alerts/sync`, {
          method: "POST",
          headers,
          credentials: "include",
        });
      } catch (e) {
        console.warn("Alerts sync failed (ignored in UI)", e);
      }

      const res = await fetch(`${apiBase}/alerts?daysAhead=30`, {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data: UserAlertsResponse = await res.json();
      setAlerts(data.alerts);
    } catch (e: any) {
      console.error("Failed to load alerts", e);
      setError("Cannot load alerts");
    } finally {
      setLoading(false);
    }
  }, [apiBase, token]);

  useEffect(() => {
    if (token) {
      loadAlerts();
    }
  }, [token, loadAlerts]);

  const unreadCount = useMemo(
    () => alerts.filter((a) => a.status === "new").length,
    [alerts]
  );

  const markRead = async (id: number) => {
    try {
      const res = await fetch(`${apiBase}/alerts/${id}/read`, {
        method: "POST",
        headers: buildAuthHeaders(token),
        credentials: "include",
      });
      if (!res.ok) return;
      const updated: UserAlertItem = await res.json();
      setAlerts((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const dismiss = async (id: number) => {
    try {
      const res = await fetch(`${apiBase}/alerts/${id}/dismiss`, {
        method: "POST",
        headers: buildAuthHeaders(token),
        credentials: "include",
      });
      if (!res.ok) return;
      await res.json();
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        <img src="/bell.png" alt="Alerts" className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-sm font-semibold">Upcoming deadlines</span>
            <button
              type="button"
              onClick={loadAlerts}
              className="text-xs text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="px-4 py-3 text-sm text-gray-500">
                Loading alerts…
              </div>
            )}

            {error && (
              <div className="px-4 py-3 text-sm text-red-500">{error}</div>
            )}

            {!loading && !error && alerts.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No upcoming deadlines.
              </div>
            )}

            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{alert.title}</div>
                    <span className="whitespace-nowrap text-xs text-gray-500">
                      {new Date(alert.dueAt).toLocaleString()}
                    </span>
                  </div>

                  {alert.url && (
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-xs text-blue-600 hover:underline"
                    >
                      Open in Moodle
                    </a>
                  )}

                  <div className="mt-2 flex gap-2">
                    {alert.status === "new" && (
                      <button
                        type="button"
                        onClick={() => markRead(alert.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => dismiss(alert.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
