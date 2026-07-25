"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoading(false);
      setError("Password salah.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="admin-eyebrow">Undangan Pernikahan</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-(--admin-ink)">
            Masuk ke Admin
          </h1>
          <p className="mt-1 text-sm text-(--admin-muted)">
            Masukkan password untuk mengelola tamu &amp; RSVP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card p-6">
          <label className="admin-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              // Toggling type avoids the browser's native reveal control, which
              // otherwise overlaps the field; we draw our own show/hide instead.
              type={show ? "text" : "password"}
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-(--admin-muted) hover:text-(--admin-ink)"
              aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-(--admin-accent)">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="admin-btn admin-btn--accent mt-5 w-full"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Inline SVG icons (no icon library / external fetch, CSP-safe). Feather-style
// stroke icons sized to the surrounding text.
function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.4 3.1M6.6 6.6A13.2 13.2 0 0 0 2 12s3.5 7 10 7a9.9 9.9 0 0 0 4-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
