import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: true,
  });
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  posthog.capture(eventName, properties);
}