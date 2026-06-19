"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

// ═══════════════════════════════════════════════════════════════════
// BookingForm — the interactive part of the BookingWidget block,
// reproducing the legacy floating-search.tsx: location dropdown + two
// date fields + a gradient search button. On submit it navigates to the
// configured fleet href (no booking store needed in the renderer).
// ═══════════════════════════════════════════════════════════════════

export default function BookingForm({
  locations,
  defaultLocation,
  actionHref,
}: {
  locations: string[];
  defaultLocation: string;
  actionHref: string;
}) {
  const [location, setLocation] = useState(defaultLocation);
  const [open, setOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [ret, setRet] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-8">
      {/* Location */}
      <div className="relative">
        <label className="label">Lieu de prise en charge</label>
        <div className="relative">
          <Icon
            name="location_on"
            className="absolute bottom-2 left-0 text-xl"
            style={{ color: "var(--site-primary)" }}
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full border-b-2 border-[#e0e3e6] bg-transparent py-2 pl-7 text-left text-sm font-semibold text-[#191c1e] transition-colors focus:border-[var(--site-primary)]"
          >
            {location}
          </button>
          {open ? (
            <div className="hide-scrollbar absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-lg border bg-white shadow-xl">
              {locations.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#f2f4f7]"
                >
                  <Icon name="location_on" className="text-lg text-[#444651]" />
                  {loc}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Pickup date */}
      <div>
        <label className="label">Date de départ</label>
        <div className="relative">
          <Icon
            name="calendar_today"
            className="absolute bottom-2 left-0 text-xl"
            style={{ color: "var(--site-primary)" }}
          />
          <input
            type="date"
            min={today}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full border-b-2 border-[#e0e3e6] bg-transparent py-2 pl-7 text-sm font-semibold text-[#191c1e] transition-colors focus:border-[var(--site-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Return date */}
      <div>
        <label className="label">Date de retour</label>
        <div className="relative">
          <Icon
            name="calendar_today"
            className="absolute bottom-2 left-0 text-xl"
            style={{ color: "var(--site-primary)" }}
          />
          <input
            type="date"
            min={pickup || today}
            value={ret}
            onChange={(e) => setRet(e.target.value)}
            className="w-full border-b-2 border-[#e0e3e6] bg-transparent py-2 pl-7 text-sm font-semibold text-[#191c1e] transition-colors focus:border-[var(--site-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-end">
        <a
          href={actionHref}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[0.98]"
          style={{
            background:
              "linear-gradient(to right, var(--site-primary), var(--site-primary-dark))",
          }}
        >
          <Icon name="search" className="text-xl" />
          Rechercher
        </a>
      </div>
    </div>
  );
}
