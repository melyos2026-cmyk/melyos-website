"use client";
import { useEffect } from "react";
// Sends the person straight to Google's review form. Link previews (WhatsApp, Facebook, email)
// don't run scripts, so they show MelyOS's photo and title from this page instead of a blank card.
export default function Go({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
}
