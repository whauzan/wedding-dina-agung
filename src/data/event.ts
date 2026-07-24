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
};
