// Shared database-offline helpers (backend/src/utils/db.ts).
// Detects "Postgres is not running" errors so routes can fall back
// gracefully instead of leaking raw Prisma errors to the client.

export function isDbOfflineError(err: any): boolean {
  const code = err?.code;
  const msg = String(err?.message || "");
  return (
    code === "P1001" || // Can't reach database server
    code === "P1002" || // Database timed out
    code === "P1017" || // Connection closed
    msg.includes("Can't reach database server") ||
    msg.includes("Connection refused") ||
    msg.includes("connect ECONNREFUSED")
  );
}

export function dbOfflineError(): any {
  const error: any = new Error(
    "Database is not running at localhost:5432. Start Postgres (e.g. `docker compose up -d db`), then retry."
  );
  error.statusCode = 503;
  return error;
}
