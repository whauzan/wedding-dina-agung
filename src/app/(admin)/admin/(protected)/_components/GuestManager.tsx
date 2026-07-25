"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Guest, GuestType } from "@/lib/guests";
import { renderWaMessage } from "@/lib/wa";

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
          <label className="mb-1 block text-sm text-ink/70" htmlFor="guest-phone">
            No. WhatsApp
          </label>
          <input
            id="guest-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812… (opsional)"
            className="rounded border border-ink/20 px-3 py-2 text-ink outline-none focus:border-ink/50"
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

      <WaTemplateEditor template={template} onSaved={setTemplate} />

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/60">
              <th className="py-2 pr-4">Nama</th>
              <th className="py-2 pr-4">Tipe</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">WhatsApp</th>
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
                onSendWa={() => openWhatsapp(guest, template)}
                copied={copiedId === guest.id}
              />
            ))}
            {guests.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-ink/50">
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
  onSendWa,
  copied,
}: {
  guest: Guest;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaved: () => void;
  onDelete: () => void;
  onCopyLink: () => void;
  onSendWa: () => void;
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
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812…"
            className="w-32 rounded border border-ink/20 px-2 py-1"
          />
        </td>
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
        {guest.phone ? (
          <button
            type="button"
            onClick={onSendWa}
            className="text-[#128C7E] underline"
          >
            Kirim WA
          </button>
        ) : (
          <span className="text-ink/30">—</span>
        )}
      </td>
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
    <div className="mb-8 rounded border border-ink/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-ink"
      >
        <span>Edit pesan WhatsApp</span>
        <span className="text-ink/50">{open ? "Tutup" : "Buka"}</span>
      </button>

      {open && (
        <div className="border-t border-ink/10 px-4 py-4">
          <p className="mb-2 text-xs text-ink/60">
            Gunakan{" "}
            <code className="rounded bg-ink/5 px-1">{"{Nama}"}</code> untuk nama
            tamu dan{" "}
            <code className="rounded bg-ink/5 px-1">{"{link}"}</code> untuk link
            undangan.
          </p>
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setStatus("idle");
            }}
            rows={10}
            className="w-full rounded border border-ink/20 px-3 py-2 text-sm text-ink outline-none focus:border-ink/50"
          />

          <p className="mt-3 mb-1 text-xs font-medium text-ink/60">Pratinjau</p>
          <pre className="mb-3 whitespace-pre-wrap rounded bg-ink/5 px-3 py-2 text-sm text-ink">
            {renderWaMessage(draft, PREVIEW_NAME, PREVIEW_LINK)}
          </pre>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !draft.trim()}
              className="rounded bg-ink px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Pesan"}
            </button>
            {status === "saved" && (
              <span className="text-sm text-[#128C7E]">Tersimpan.</span>
            )}
            {status === "error" && (
              <span className="text-sm text-seal">Gagal menyimpan.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
