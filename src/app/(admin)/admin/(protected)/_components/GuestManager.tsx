"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest, GuestType } from "@/lib/guests";

const TYPE_LABEL: Record<GuestType, string> = {
  akad_resepsi: "Akad & Resepsi",
  resepsi: "Resepsi",
};

export function GuestManager({ guests }: { guests: Guest[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<GuestType>("resepsi");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Gagal menambahkan tamu.");
      return;
    }

    setName("");
    setType("resepsi");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus tamu ini?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleCopyLink(slug: string, id: string) {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1500);
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-ink/70" htmlFor="guest-name">
            Nama Tamu
          </label>
          <input
            id="guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-ink/20 px-3 py-2 text-ink outline-none focus:border-ink/50"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink/70" htmlFor="guest-type">
            Tipe Undangan
          </label>
          <select
            id="guest-type"
            value={type}
            onChange={(e) => setType(e.target.value as GuestType)}
            className="rounded border border-ink/20 px-3 py-2 text-ink outline-none focus:border-ink/50"
          >
            <option value="resepsi">Resepsi</option>
            <option value="akad_resepsi">Akad &amp; Resepsi</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded bg-ink px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Menambahkan..." : "Tambah Tamu"}
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-seal">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/60">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Tipe</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <GuestRow
                key={guest.id}
                guest={guest}
                isEditing={editingId === guest.id}
                onStartEdit={() => setEditingId(guest.id)}
                onCancelEdit={() => setEditingId(null)}
                onSaved={() => {
                  setEditingId(null);
                  router.refresh();
                }}
                onDelete={() => handleDelete(guest.id)}
                onCopyLink={() => handleCopyLink(guest.slug, guest.id)}
                copied={copiedId === guest.id}
              />
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-ink/50">
                  Belum ada tamu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GuestRow({
  guest,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onDelete,
  onCopyLink,
  copied,
}: {
  guest: Guest;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaved: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
  copied: boolean;
}) {
  const [name, setName] = useState(guest.name);
  const [type, setType] = useState<GuestType>(guest.type);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type }),
    });
    setSaving(false);
    onSaved();
  }

  if (isEditing) {
    return (
      <tr className="border-b border-ink/5">
        <td className="py-2 pr-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-ink/20 px-2 py-1"
          />
        </td>
        <td className="py-2 pr-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GuestType)}
            className="rounded border border-ink/20 px-2 py-1"
          >
            <option value="resepsi">Resepsi</option>
            <option value="akad_resepsi">Akad &amp; Resepsi</option>
          </select>
        </td>
        <td className="py-2 pr-4 text-ink/50">{guest.slug}</td>
        <td className="py-2 pr-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="text-ink underline disabled:opacity-50"
            >
              Simpan
            </button>
            <button type="button" onClick={onCancelEdit} className="text-ink/50 underline">
              Batal
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-ink/5">
      <td className="py-2 pr-4">{guest.name}</td>
      <td className="py-2 pr-4">{TYPE_LABEL[guest.type]}</td>
      <td className="py-2 pr-4 text-ink/50">{guest.slug}</td>
      <td className="py-2 pr-4">
        <div className="flex gap-3">
          <button type="button" onClick={onCopyLink} className="text-ink underline">
            {copied ? "Tersalin!" : "Salin Link"}
          </button>
          <button type="button" onClick={onStartEdit} className="text-ink underline">
            Edit
          </button>
          <button type="button" onClick={onDelete} className="text-seal underline">
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
}
