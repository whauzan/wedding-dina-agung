"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-2xl font-semibold text-ink">Admin Login</h1>
        <label className="mb-1 block text-sm text-ink/70" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-ink/20 px-3 py-2 text-ink outline-none focus:border-ink/50"
        />
        {error && <p className="mb-4 text-sm text-seal">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded bg-ink px-4 py-2 text-white transition disabled:opacity-50"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
