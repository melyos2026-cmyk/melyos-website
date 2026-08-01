"use client";

import { useState } from "react";

export default function ComingSoonPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function accessWebsite() {
    if (password.trim() === "MelyOS2026") {
      window.sessionStorage.setItem(
        "melyos-preview-access",
        "granted"
      );

      window.location.reload();
      return;
    }

    setError("Incorrect password");
  }

  return (
    <main className="min-h-screen bg-[#06182e] text-white">
      {/* MOBILE AND TABLET */}
      <div className="flex min-h-screen flex-col md:hidden">
        <div className="w-full bg-[#06182e]">
          <>
  {/* Mobile */}
  <img
    src="/coming-soon-mobile2.png"
    alt="MelyOS Coming Soon"
    className="block w-full md:hidden"
  />

  {/* Desktop */}
  <img
    src="/coming-soon-hero.png"
    alt="MelyOS Coming Soon"
    className="hidden h-auto w-full object-contain md:block"
  />
</>
        </div>

        <div className="flex flex-1 items-start justify-center px-4 py-6">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#081d36] p-5 shadow-2xl">
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  accessWebsite();
                }
              }}
              placeholder="Enter password"
              autoComplete="off"
              className="w-full rounded-2xl border border-white/25 bg-[#06182e] px-5 py-4 text-base text-white outline-none placeholder:text-slate-400 focus:border-[#22c7e5]"
            />

            <button
              type="button"
              onClick={accessWebsite}
              className="mt-4 w-full rounded-2xl bg-[#08B8D8] px-6 py-4 text-base font-black text-white shadow-xl transition active:scale-[0.98]"
            >
              Access Website
            </button>

            {error && (
              <p className="mt-3 text-center text-sm font-semibold text-red-300">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden min-h-screen overflow-hidden md:block">
        <img
          src="/coming-soon-hero.png"
          alt="MelyOS Coming Soon"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute bottom-[105px] right-[185px] z-20 flex items-center gap-3">
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                accessWebsite();
              }
            }}
            placeholder="Enter password"
            autoComplete="off"
            className="w-44 rounded-xl border border-white/30 bg-[#06182e]/90 px-4 py-3 text-sm text-white shadow-xl outline-none backdrop-blur-md placeholder:text-slate-400 focus:border-[#39d5ee]"
          />

          <button
            type="button"
            onClick={accessWebsite}
            className="cursor-pointer rounded-xl bg-[#08B8D8] px-5 py-3 text-sm font-black text-white shadow-xl transition hover:bg-[#079db9]"
          >
            Access Website
          </button>

          {error && (
            <p className="absolute left-0 top-full mt-2 text-xs font-semibold text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
