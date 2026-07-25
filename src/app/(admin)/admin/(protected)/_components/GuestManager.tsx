"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest, GuestType } from "@/lib/guests";
import { renderWaMessage } from "@/lib/wa";
import Image from "next/image";

const TYPE_LABEL: Record<GuestType, string> = {
  akad_resepsi: "Akad & Resepsi",
  resepsi: "Resepsi",
};

// Opens the wa.me deep link (app on mobile, WhatsApp Web on desktop) with the
// number preselected and the message prefilled from the admin-edited template.
// Guest.phone is already in wa.me format (digits, country code, no "+").
function openWhatsapp(guest: Guest, template: string) {
  const inviteUrl = `${window.location.origin}/${guest.slug}`;
  const text = encodeURIComponent(
    renderWaMessage(template, guest.name, inviteUrl),
  );
  window.open(`https://wa.me/${guest.phone}?text=${text}`, "_blank");
}

export function GuestManager({
  guests,
  waTemplate,
}: {
  guests: Guest[];
  waTemplate: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<GuestType>("resepsi");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [template, setTemplate] = useState(waTemplate);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, phone }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Gagal menambahkan tamu.");
      return;
    }

    setName("");
    setType("resepsi");
    setPhone("");
    router.refresh();
  }

  // Stable callbacks so the memoized GuestRow doesn't re-render on every
  // keystroke in the add-form (which re-renders this parent). They take the
  // guest identifiers as args instead of closing over a specific row.
  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Hapus tamu ini?")) return;
      await fetch(`/api/guests/${id}`, { method: "DELETE" });
      router.refresh();
    },
    [router],
  );

  const handleCopyLink = useCallback(async (slug: string, id: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(
      () => setCopiedId((current) => (current === id ? null : current)),
      1500,
    );
  }, []);

  const handleSendWa = useCallback(
    (guest: Guest) => openWhatsapp(guest, template),
    [template],
  );

  const handleStartEdit = useCallback((id: string) => setEditingId(id), []);
  const handleCancelEdit = useCallback(() => setEditingId(null), []);
  const handleSaved = useCallback(() => {
    setEditingId(null);
    router.refresh();
  }, [router]);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAdd} className="admin-card p-5">
        <p className="admin-eyebrow mb-4">Tambah tamu</p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-40 flex-1">
            <label className="admin-label" htmlFor="guest-name">
              Nama tamu
            </label>
            <input
              id="guest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="admin-input"
              required
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="admin-label" htmlFor="guest-phone">
              No. WhatsApp{" "}
              <span className="font-normal text-(--admin-faint)">
                (opsional)
              </span>
            </label>
            <input
              id="guest-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812…"
              className="admin-input"
            />
          </div>
          <div className="min-w-40 flex-1">
            <label className="admin-label" htmlFor="guest-type">
              Tipe undangan
            </label>
            <select
              id="guest-type"
              value={type}
              onChange={(e) => setType(e.target.value as GuestType)}
              className="admin-input"
            >
              <option value="resepsi">Resepsi</option>
              <option value="akad_resepsi">Akad &amp; Resepsi</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="admin-btn admin-btn--accent"
          >
            {submitting ? "Menambahkan..." : "Tambah tamu"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-(--admin-accent)">{error}</p>}
      </form>

      <WaTemplateEditor template={template} onSaved={setTemplate} />

      <div className="admin-card overflow-x-auto">
        <table className="admin-table min-w-max">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Slug</th>
              <th>WhatsApp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <GuestRow
                key={guest.id}
                guest={guest}
                isEditing={editingId === guest.id}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaved={handleSaved}
                onDelete={handleDelete}
                onCopyLink={handleCopyLink}
                onSendWa={handleSendWa}
                copied={copiedId === guest.id}
              />
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-(--admin-muted)">
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

const GuestRow = memo(function GuestRow({
  guest,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaved,
  onDelete,
  onCopyLink,
  onSendWa,
  copied,
}: {
  guest: Guest;
  isEditing: boolean;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaved: () => void;
  onDelete: (id: string) => void;
  onCopyLink: (slug: string, id: string) => void;
  onSendWa: (guest: Guest) => void;
  copied: boolean;
}) {
  const [name, setName] = useState(guest.name);
  const [type, setType] = useState<GuestType>(guest.type);
  const [phone, setPhone] = useState(guest.phone ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/guests/${guest.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, phone }),
    });
    setSaving(false);
    onSaved();
  }

  if (isEditing) {
    return (
      <tr>
        <td>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-input w-36"
          />
        </td>
        <td>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GuestType)}
            className="admin-input w-40"
          >
            <option value="resepsi">Resepsi</option>
            <option value="akad_resepsi">Akad &amp; Resepsi</option>
          </select>
        </td>
        <td className="text-(--admin-faint)">{guest.slug}</td>
        <td>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812…"
            className="admin-input w-32"
          />
        </td>
        <td>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="admin-action"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="admin-action"
            >
              Batal
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="font-medium text-(--admin-ink)">{guest.name}</td>
      <td>
        <span className="admin-pill">{TYPE_LABEL[guest.type]}</span>
      </td>
      <td className="text-(--admin-faint)">{guest.slug}</td>
      <td>
        {guest.phone ? (
          <button
            type="button"
            onClick={() => onSendWa(guest)}
            className="admin-action admin-action--wa"
          >
            <Image
              src="/icon_whatsapp.svg"
              alt="Icon whatsapp"
              width={16}
              height={16}
            />
            Kirim WA
          </button>
        ) : (
          <span className="text-(--admin-faint)">Belum ada</span>
        )}
      </td>
      <td>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onCopyLink(guest.slug, guest.id)}
            className="admin-action"
          >
            {copied ? "Tersalin!" : "Salin link"}
          </button>
          <button
            type="button"
            onClick={() => onStartEdit(guest.id)}
            className="admin-action"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(guest.id)}
            className="admin-action admin-action--danger"
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
});

// Sample values used only for the live preview inside the editor.
const PREVIEW_NAME = "Budi Santoso";
const PREVIEW_LINK = "https://…/budi-santoso";

// Collapsible editor for the WhatsApp invite template. Persists to the settings
// table via PUT /api/settings/wa-template and lifts the saved value back up so
// the "Kirim WA" buttons use it immediately without a page refresh.
function WaTemplateEditor({
  template,
  onSaved,
}: {
  template: string;
  onSaved: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(template);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  async function handleSave() {
    setSaving(true);
    setStatus("idle");

    const res = await fetch("/api/settings/wa-template", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: draft }),
    });

    setSaving(false);

    if (!res.ok) {
      setStatus("error");
      return;
    }

    const { template: saved } = (await res.json()) as { template: string };
    setDraft(saved);
    onSaved(saved);
    setStatus("saved");
  }

  return (
    <div className="admin-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-(--admin-ink)">
          Edit pesan WhatsApp
        </span>
        <span
          aria-hidden
          className={`text-(--admin-muted) transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-(--admin-border) px-5 py-5">
          <p className="text-xs text-(--admin-muted)">
            Gunakan{" "}
            <code className="rounded bg-(--admin-surface-2) px-1 py-0.5 font-mono">
              {"{Nama}"}
            </code>{" "}
            untuk nama tamu dan{" "}
            <code className="rounded bg-(--admin-surface-2) px-1 py-0.5 font-mono">
              {"{link}"}
            </code>{" "}
            untuk link undangan.
          </p>

          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setStatus("idle");
            }}
            rows={10}
            className="admin-input resize-y font-mono leading-relaxed"
          />

          <div>
            <p className="admin-eyebrow mb-1.5">Pratinjau</p>
            <pre className="overflow-x-auto rounded-lg border border-(--admin-border) bg-(--admin-surface-2) px-3 py-2.5 text-sm whitespace-pre-wrap text-(--admin-ink)">
              {renderWaMessage(draft, PREVIEW_NAME, PREVIEW_LINK)}
            </pre>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="admin-btn admin-btn--accent"
            >
              {saving ? "Menyimpan..." : "Simpan pesan"}
            </button>
            {status === "saved" && (
              <span className="text-sm text-(--admin-ok)">Tersimpan.</span>
            )}
            {status === "error" && (
              <span className="text-sm text-(--admin-accent)">
                Gagal menyimpan.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
