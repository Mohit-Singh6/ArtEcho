// @healix:auto-error-tracking
const WEBHOOK_URL = "https://healix.mohits.site/api/telemetry/ingest/0ddd71a6-99ae-4c2c-8c14-ec935766ff88";
const SERVICE_NAME = "ArtEcho";

function errorDetails(error) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error && error.stack ? error.stack : message;
  return { message, stack };
}

function reportServerError(
  error,
  route,
  method,
  routeType,
) {
  try {
    const details = errorDetails(error);
    void fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceName: SERVICE_NAME,
        message: "[server] " + details.message,
        stackTrace: details.stack,
        environment: "server",
        route,
        method,
        routeType,
        endpoint: route,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  } catch {}
}

function healixErrorTrackingMiddleware(error, request, _response, next) {
  reportServerError(error, request.originalUrl || request.path, request.method);
  next(error);
}

function installProcessErrorHandlers() {
  if (typeof process === "undefined") return;
  process.on("uncaughtExceptionMonitor", (error) => reportServerError(error, "process", "uncaughtException"));
  process.on("unhandledRejection", (reason) => reportServerError(reason, "process", "unhandledRejection"));
}

installProcessErrorHandlers();

module.exports = { healixErrorTrackingMiddleware, installProcessErrorHandlers };
