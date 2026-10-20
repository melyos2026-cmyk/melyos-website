"use client";

import { useEffect, useRef, useState } from "react";

// Oct 20 (per Mely): Mely chat on melyos.io for future clients.
// Oct 20 (per Mely): no language button — Mely answers in whatever language the
// visitor writes. The greeting follows the visitor's browser language.

type Msg = { role: "user" | "assistant"; content: string };

const T = {
  en: { hi: "Hi! I'm Mely 👋 I can tell you how MelyOS works for your property, or set up a personalized demo. How can I help?", ph: "Type your question…", send: "Send", title: "Ask Mely", sub: "MelyOS assistant", thinking: "Mely is typing…" },
  es: { hi: "¡Hola! Soy Mely 👋 Te cuento cómo funciona MelyOS para tu propiedad o te agendo una demo personalizada. ¿En qué te ayudo?", ph: "Escribe tu pregunta…", send: "Enviar", title: "Pregúntale a Mely", sub: "Asistente de MelyOS", thinking: "Mely está escribiendo…" },
  pt: { hi: "Olá! Sou a Mely 👋 Posso explicar como o MelyOS funciona para sua propriedade ou agendar uma demonstração. Como posso ajudar?", ph: "Escreva sua pergunta…", send: "Enviar", title: "Fale com a Mely", sub: "Assistente MelyOS", thinking: "Mely está digitando…" },
  fr: { hi: "Bonjour ! Je suis Mely 👋 Je peux vous expliquer comment MelyOS fonctionne pour votre établissement ou organiser une démo. Comment puis-je vous aider ?", ph: "Écrivez votre question…", send: "Envoyer", title: "Parlez à Mely", sub: "Assistante MelyOS", thinking: "Mely écrit…" },
};
type Lang = keyof typeof T;

export default function MelyChat() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const b = (navigator.language || "").slice(0, 2).toLowerCase();
      if (b in T) setLang(b as Lang);
    } catch {}
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy, open]);

  const t = T[lang];
  const shown: Msg[] = [{ role: "assistant", content: t.hi }, ...msgs];

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/mely", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "assistant", content: t.hi }, ...next].slice(1) }) });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: j.reply || "…" }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: lang === "es" ? "No pude responder. Intenta otra vez o usa el formulario de demo." : "I couldn't answer. Please try again or use the demo form." }]);
    }
    setBusy(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t.title}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#071A33] py-2 pl-2 pr-4 text-white shadow-2xl transition hover:scale-105"
        >
          <img src="/mely-avatar-v2.jpg" alt="" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-sm font-bold">{t.title}</span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(560px,calc(100vh-32px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center gap-3 bg-[#071A33] px-4 py-3 text-white">
            <img src="/mely-avatar-v2.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
            <div className="flex-1">
              <div className="text-sm font-bold">{t.title}</div>
              <div className="text-[11px] text-slate-300">{t.sub}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="ml-1 text-xl leading-none">×</button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-3">
            {shown.map((m, i) => (
              <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-[#08B8D8] text-white" : "bg-white text-slate-800 shadow-sm"}`}>
                {m.content}
              </div>
            ))}
            {busy && <div className="text-xs text-slate-500">{t.thinking}</div>}
            <div ref={end} />
          </div>
          <div className="flex gap-2 border-t border-slate-200 p-2">
            <input
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              placeholder={t.ph}
              value={input}
              maxLength={1500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            />
            <button onClick={send} disabled={busy} className="rounded-xl bg-[#071A33] px-4 text-sm font-bold text-white disabled:opacity-50">{t.send}</button>
          </div>
        </div>
      )}
    </>
  );
}
