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
    mapsUrl: "https://maps.app.goo.gl/XjBVJUJ45FiGMXiE8",
  } satisfies EventDetails,
  resepsi: {
    label: "Resepsi",
    day: "Sabtu",
    date: "22 08 2026",
    time: "11:00 - 13:00",
    venueName: "Masjid Raya Baitul Mukhtar BSD",
    address:
      "Jl. BSD Raya Pusat, Pagedangan, Kec. Pagedangan, Kabupaten Tangerang, Banten 15339",
    mapsUrl: "https://maps.app.goo.gl/XjBVJUJ45FiGMXiE8",
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
