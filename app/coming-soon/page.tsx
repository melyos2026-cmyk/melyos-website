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
    <main className="relative min-h-screen overflow-hidden bg-[#06182e]">
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
    </main>
  );
}
