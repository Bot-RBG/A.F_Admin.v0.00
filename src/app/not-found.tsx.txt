import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6">
      <div className="max-w-md text-center">
        <div className="text-7xl font-bold text-[var(--primary)] mb-3">404</div>
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Page not found</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-2 justify-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md text-sm font-medium hover:bg-[var(--primary-hover)]"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-[var(--border-strong)] text-[var(--text)] rounded-md text-sm font-medium hover:bg-[var(--surface-muted)]"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
