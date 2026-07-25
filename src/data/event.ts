/**
 * Placeholder date/time/venue — real wedding date still TBD (CLAUDE.md §9).
 * Swap these values once the couple confirms; nothing else needs to change.
 */

export type EventDetails = {
  label: string;
  day: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  mapsUrl: string;
};

export type BankAccount = {
  logo: string; // path under /public, e.g. "/mandiri.svg"
  name: string; // bank name, for alt text
  holder: string; // "Atas Nama"
  number: string;
};

export type GiftAddress = {
  recipient: string;
  detail: string;
};

export const wedding = {
  couple: { groom: "Agung Nugroho", bride: "Yudia Putri M." },
  akad: {
    label: "Akad",
    day: "Sabtu",
    date: "22 08 2026",
    time: "08:00 - 09:00",
    venueName: "Masjid Raya Baitul Mukhtar BSD",
    address:
      "Jl. BSD Raya Pusat, Pagedangan, Kec. Pagedangan, Kabupaten Tangerang, Banten 15339",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Masjid+Raya+Baitul+Mukhtar+BSD",
  } satisfies EventDetails,
  resepsi: {
    label: "Resepsi",
    day: "Sabtu",
    date: "22 08 2026",
    time: "11:00 - 13:00",
    venueName: "Masjid Raya Baitul Mukhtar BSD",
    address:
      "Jl. BSD Raya Pusat, Pagedangan, Kec. Pagedangan, Kabupaten Tangerang, Banten 15339",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Masjid+Raya+Baitul+Mukhtar+BSD",
  } satisfies EventDetails,
  gift: {
    banks: [
      {
        logo: "/bca.svg",
        name: "BCA",
        holder: "Agung Nugroho",
        number: "4740908915",
      },
      {
        logo: "/bca.svg",
        name: "BCA",
        holder: "Yudia Putri",
        number: "7611058016",
      },
      {
        logo: "/mandiri.svg",
        name: "Mandiri",
        holder: "Yudia Putri",
        number: "1760005610462",
      },
    ] satisfies BankAccount[],
    address: {
      recipient: "Yudia Putri",
      detail: "Dasana Indah blok SJ 4 No.29 RT02 RW15, Kel. Bojong Nangka, Kec. Kelapa Dua, Kab. Tangerang 15810",
    } satisfies GiftAddress,
  },
};

/**
 * Guest-facing copy for the RSVP + Wishes section, centralized here so the
 * client can tweak wording without touching JSX (CLAUDE.md §9.6). All strings
 * are Indonesian.
 */
export type Attendance = "hadir" | "tidak_hadir" | "ragu";

export const rsvp = {
  title: "RSVP",
  subtitle: "Konfirmasi kehadiran anda dengan",
  nameLabel: "Nama Anda",
  namePlaceholder: "Tulis Nama Anda",
  countLabel: "Jumlah Kehadiran",
  attendanceLabel: "Konfirmasi Kehadiran",
  selectPlaceholder: "Pilih",
  submit: "Kirim",
  submitting: "Mengirim...",
  success: "Terima kasih, kehadiran Anda sudah kami terima.",
  error: "Maaf, terjadi kesalahan. Coba lagi.",
  // Jumlah Kehadiran — 1–2 orang.
  countOptions: [
    { value: 1, label: "1 Orang" },
    { value: 2, label: "2 Orang" },
  ],
  attendanceOptions: [
    { value: "hadir", label: "Hadir" },
    { value: "tidak_hadir", label: "Tidak Hadir" },
  ] satisfies { value: Attendance; label: string }[],
};

export const closing = {
  title: "Terima Kasih",
  body: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan do'a restu kepada kami.",
  signOff: "Kami yang berbahagia,",
  names: "Agung & Yudia",
};

export const wishes = {
  title: "Best Wishes",
  subtitle: "Sampaikan doa dan ucapan terbaik anda",
  nameLabel: "Nama Anda",
  namePlaceholder: "Tulis Nama Anda",
  messageLabel: "Tulis ucapan",
  messagePlaceholder: "Tulis ucapan",
  submit: "Kirim",
  submitting: "Mengirim...",
  error: "Maaf, terjadi kesalahan. Coba lagi.",
  empty: "Jadilah yang pertama memberi ucapan.",
};
