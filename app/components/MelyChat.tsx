"use client";

import { useEffect, useRef, useState } from "react";

// Oct 20 (per Mely): Mely chat on melyos.io for future clients.
// Oct 20 (per Mely): no language button — Mely answers in whatever language the
// visitor writes. The greeting follows the visitor's browser language.

type Msg = { role: "user" | "assistant"; content: string };

// Oct 24 (per Mely): Mely is the star salesperson — a welcome bubble invites visitors to ask her
// anything, with starter questions so the conversation begins with one tap.
const T = {
  en: { hi: "Hi! I'm Mely 👋 I can tell you how MelyOS works for your property, or set up a personalized demo. How can I help?", ph: "Type your question…", send: "Send", title: "Ask Mely", sub: "MelyOS assistant · answers in seconds", thinking: "Mely is typing…",
    tease: "Questions? Ask me anything about MelyOS — the interactive map, online reservations, billing, what it costs to run. I'll show you how it works for your property.",
    teaseBtn: "Chat with Mely", starters: ["How does the interactive map work?", "What's included in MelyOS?", "Does it work for marinas?", "How do I get a quote?"] },
  es: { hi: "¡Hola! Soy Mely 👋 Te cuento cómo funciona MelyOS para tu propiedad o te agendo una demo personalizada. ¿En qué te ayudo?", ph: "Escribe tu pregunta…", send: "Enviar", title: "Pregúntale a Mely", sub: "Asistente de MelyOS · responde al instante", thinking: "Mely está escribiendo…",
    tease: "¿Dudas? Pregúntame lo que quieras sobre MelyOS: el mapa interactivo, reservaciones online, facturación, cómo funciona. Te muestro cómo sería para tu propiedad.",
    teaseBtn: "Hablar con Mely", starters: ["¿Cómo funciona el mapa interactivo?", "¿Qué incluye MelyOS?", "¿Sirve para marinas?", "¿Cómo pido una cotización?"] },
  pt: { hi: "Olá! Sou a Mely 👋 Posso explicar como o MelyOS funciona para sua propriedade ou agendar uma demonstração. Como posso ajudar?", ph: "Escreva sua pergunta…", send: "Enviar", title: "Fale com a Mely", sub: "Assistente MelyOS · responde na hora", thinking: "Mely está digitando…",
    tease: "Dúvidas? Pergunte o que quiser sobre o MelyOS: o mapa interativo, reservas online, cobrança. Eu mostro como seria para a sua propriedade.",
    teaseBtn: "Falar com a Mely", starters: ["Como funciona o mapa interativo?", "O que está incluído?", "Funciona para marinas?", "Como peço um orçamento?"] },
  fr: { hi: "Bonjour ! Je suis Mely 👋 Je peux vous expliquer comment MelyOS fonctionne pour votre établissement ou organiser une démo. Comment puis-je vous aider ?", ph: "Écrivez votre question…", send: "Envoyer", title: "Parlez à Mely", sub: "Assistante MelyOS · répond en quelques secondes", thinking: "Mely écrit…",
    tease: "Des questions ? Demandez-moi tout sur MelyOS : la carte interactive, les réservations en ligne, la facturation. Je vous montre comment ça marche pour votre établissement.",
    teaseBtn: "Parler à Mely", starters: ["Comment fonctionne la carte interactive ?", "Qu'est-ce qui est inclus ?", "Ça marche pour les marinas ?", "Comment obtenir un devis ?"] },
};
type Lang = keyof typeof T;

export default function MelyChat() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tease, setTease] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  // Welcome bubble: appears after a few seconds, once per visit, until the chat is opened or dismissed.
  useEffect(() => {
    let seen = false; try { seen = sessionStorage.getItem("mely_tease") === "1"; } catch {}
    if (seen) return;
    const id = setTimeout(() => setTease(true), 4000); return () => clearTimeout(id);
  }, []);
  const dismissTease = () => { setTease(false); try { sessionStorage.setItem("mely_tease", "1"); } catch {} };

  useEffect(() => {
    try {
      const b = (navigator.language || "").slice(0, 2).toLowerCase();
      if (b in T) setLang(b as Lang);
    } catch {}
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy, open]);

  const t = T[lang];
  const shown: Msg[] = [{ role: "assistant", content: t.hi }, ...msgs];

  async function send(preset?: string) {
    const text = (preset ?? input).trim();
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
      {!open && tease && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(320px,calc(100vw-40px))] rounded-2xl bg-white p-4 text-slate-800 shadow-2xl ring-1 ring-slate-200">
          <button onClick={dismissTease} aria-label="Close" className="absolute right-2 top-1 text-lg leading-none text-slate-400 hover:text-slate-700">×</button>
          <div className="flex items-start gap-3">
            <img src="/mely-avatar-v2.jpg" alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            <p className="text-sm leading-snug">{t.tease}</p>
          </div>
          <button onClick={() => { dismissTease(); setOpen(true); }} className="mt-3 w-full rounded-xl bg-[#08B8D8] py-2 text-sm font-bold text-white hover:bg-[#09a6c3]">{t.teaseBtn} →</button>
        </div>
      )}
      {!open && (
        <button
          onClick={() => { dismissTease(); setOpen(true); }}
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
            {msgs.length === 0 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {t.starters.map((q) => <button key={q} onClick={() => send(q)} className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#071A33] hover:bg-cyan-50">{q}</button>)}
              </div>
            )}
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
            <button onClick={() => send()} disabled={busy} className="rounded-xl bg-[#071A33] px-4 text-sm font-bold text-white disabled:opacity-50">{t.send}</button>
          </div>
        </div>
      )}
    </>
  );
}
