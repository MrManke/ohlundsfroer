<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend & UI Regler (Öhlundsfröer Web)

## 1. Säkerhet & Arkitektur
* **Ingen Firebase Admin i klientkod:** Firebase Admin SDK eller serverbibliotek får ALDRIG importeras i `"use client"`.
* **Ingen direkt Firestore i React-komponenter:** Kassa, bokningar och datainteraktion sker via Next.js Server Actions eller definierade API-rutter validerade med Zod.

## 2. Mobil-First UI & Tillgänglighet (WCAG AA)
* **Mobile-First som bas:** Bygg för mobil vy (från 360 px) och skala uppåt med Tailwind (`sm:`, `md:`, `lg:`). Horisontell sidscroll är strängt förbjuden (`scrollWidth <= innerWidth`).
* **Touch-ytor:** Alla interaktiva touchytor på mobil ska vara minst 44×44 pixlar.
* **Typografiskt klippskydd (Å, Ä, Ö):** Förbud mot `leading-none` på rubriker och logotyper med svenska bokstäver. Använd alltid `leading-tight` eller `leading-snug` samt minst `pt-1`/`py-1` i luft.
* **Färger från temat:** Använd uteslutande tokens från Tailwind-konfigurationen (`bg-pine`, `bg-oat`, `bg-terracotta`, `text-bark` etc.). Hårdkoda aldrig HEX-koder i komponenter.
* **UI-minimalism:** Standard-emojis (🌱, 🌸, 📦 etc.) är FÖRBJUDNA i gränssnittet. Använd ren typografi och monokroma SVG-ikoner.

## 3. Köpflöde, Varukorg & Navigation
* **Ingen automatisk skärmstöld:** Klick på köpknapp visar en diskret toast i botten (`✓ Luktärt 'Morgonbris' lades till [Öppna]`). Drawern får ALDRIG öppnas automatiskt.
* **Mobil Drawers:** Ska expandera till full bredd (`w-full sm:w-[430px]`) på mobil, använda `h-[100dvh]` och ha `flex-1 min-h-0 overflow-y-auto` på artikellistan.
* **Ordavhuggning:** Knappar och åtgärder som "Ta bort" ska ha `whitespace-nowrap`.
* **Persistent varukorg:** Synka alltid varukorgens tillstånd och aktiva rabattkoder mot `localStorage` så att data inte förloras vid sidomladdning (F5).
* **Mobilnavigering:** Tillhandahåll både tumvänliga snabbknappar och en fullständig meny (☰) så att mobilanvändare enkelt når alla sektioner.

## 4. Fraktsmart Kassa
* **Fraktklasser:** Respektera `FLAT_LETTER` (29 kr, fri frakt över 350 kr) och `BULKY_PARCEL` (79 kr paketfrakt till ombud).
* **Tydlig fri frakt:** När fri frakt uppnås ska gränssnittet tydligt visa `0 kr (Fri frakt)` och inte visa fasta fraktnotiser.
