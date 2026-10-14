export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>500 — Server Error · SmartTrip</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --bg: #f8fafc;
        --card: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --primary: #0284c7;
        --border: #e2e8f0;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #0f172a;
          --card: #1e293b;
          --text: #f8fafc;
          --muted: #94a3b8;
          --primary: #38bdf8;
          --border: #334155;
        }
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: var(--bg);
        color: var(--text);
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        box-sizing: border-box;
      }
      .card {
        max-width: 30rem;
        width: 100%;
        text-align: center;
        padding: 2.5rem 2rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 1.5rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 9999px;
        background: rgba(2, 132, 199, 0.15);
        color: var(--primary);
        margin-bottom: 1rem;
      }
      h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.75rem; }
      p { color: var(--muted); font-size: 0.9375rem; line-height: 1.6; margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.625rem 1.25rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s ease;
      }
      .primary {
        background: var(--primary);
        color: #ffffff;
        border: none;
      }
      .primary:hover { opacity: 0.9; }
      .secondary {
        background: transparent;
        color: var(--text);
        border: 1px solid var(--border);
      }
      .secondary:hover { background: rgba(0, 0, 0, 0.04); }
    </style>
  </head>
  <body>
    <div class="card" role="alert" aria-live="assertive">
      <div class="badge">500 Server Error</div>
      <h1>Something unexpected occurred</h1>
      <p>We encountered a temporary server error. We've captured the telemetry, and you can try refreshing or return to the home page.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reload Page</button>
        <a class="secondary" href="/">Go to Homepage</a>
      </div>
    </div>
  </body>
</html>`;
}
