"use client";

import { useEffect } from "react";
import { initPostHog, trackEvent } from "@/lib/analytics";

export default function PostHogProvider() {
  useEffect(() => {
    initPostHog();

    trackEvent("tool_visited");
  }, []);

  return null;
}