/**
 * Application error reporting utility.
 * Logs errors in development and acts as an integration point for
 * monitoring services (e.g. Sentry, LogRocket, Datadog).
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}): void {
  console.error("[Reported Error]", error, context);

  // Future integration point:
  // if (typeof window !== "undefined" && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
}
