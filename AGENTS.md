# AGENTS.md – Globala arkitektur- & systemregler (Öhlundsfröer)

> Denna rotfil sätter de gemensamma järnreglerna för alla AI-kodagenter i projektet.
> För domänspecifika regler, se lokala `AGENTS.md` och dokumentation i respektive katalog.

---

## 1. Arkitektur & Modulstruktur

* **Teknikstack:** TypeScript (strikt), Next.js 16 (App Hosting), Cloud Functions v2 (Node.js 24), Cloud Firestore, Stripe.
* **Modulär monolit:** Koden är uppdelad i `packages/modules/<modul>` samt `apps/web`.
* **Strikt inkapsling:** Enda tillåtna importyta mellan moduler är respektive moduls `src/index.ts`. All kod under `internal/**` är strikt privat för modulen (kontrolleras av `eslint-plugin-boundaries`).
* **Databas-isolering:** Varje modul äger sina egna Firestore-samlingar (t.ex. `inventory_skus`, `finance_entries`). Direktskrivningar eller läsningar över modulgränser är förbjudna.

---

## 2. Järnhårda systemprinciper (Guardrails)

* **Pengar & Valuta:** Alla belopp sparas uteslutande som heltal i öre/cents (`amountInCents`). Flyttal för valuta är strängt förbjudet.
* **Kontraktstyrning:** All data som korsar modulgränser eller API-endpoints MÅSTE valideras med Zod i runtime.
* **Lagersaldo & ACID:** Alla lagerminskningar och reservationer MÅSTE ske inuti en atomisk Firestore-transaktion (`runTransaction`). Reservationer av bukettpaket sker atomiskt som all-or-nothing.
* **TTL på reservationer:** Varukorgsreservationer har 30 minuters TTL och återförs automatiskt till disponibelt saldo vid avbruten order.
* **Idempotens & Händelser:** Alla bakgrundstriggers definieras med `{ retry: true }` och hanterar ett unikt `eventId` för att garantera idempotens.
* **Bokföring:** Poster i `finance_entries` är oföränderliga (immutable). Korrigering sker uteslutande via motbokning.
* **Ingen kod utan tester:** Varje ny metod eller fix ska ha tester. Befintliga tester får aldrig inaktiveras (`test.skip`) eller sänkas.

## 3. Agentic Workflow & Samarbetsregler

* **Filbaserad handoff (.antigravity/task.md):** Alla sessioner och subagenter använder `.antigravity/task.md` som delat arbetsminne (Single Source of Truth). Uppdatera alltid checklistan där efter slutförd uppgift.
* **Skriv direkt till källfiler:** Agenter modifierar alltid kodfiler direkt på disk via verktygen. Dumpa aldrig tusentals rader kodförslag i chatten.
* **Typerna är gränssnittet:** Vid arbete i en modul eller app ska agenten endast konsultera målets Zod-scheman och publika `src/index.ts`. Intern kod (`internal/**`) är privat.
* **Dämpad terminaloutput vid verifiering:** Kör alltid verifieringskommandon i tyst läge (t.ex. `pnpm turbo test --silent` eller `tsc --noEmit`). Vid fel styrs felloggen till en tillfällig fil (`.tmp/error.log`) så att endast de relevanta felraderna granskas.
* **Rollstyrning (Orchestrator vs Specialist):** Orchestratorn bryter ner faser till mikrouppgifter i `.antigravity/task.md` och delegerar. Specialistagenter har lasersikte på en mikrouppgift, verifierar tyst, uppdaterar `task.md` och avslutar.

---

## 4. Deterministisk Verifieringsloop

Innan en uppgift markeras som klar i `.antigravity/task.md` MÅSTE verifieringssviten köras och visa noll fel:
1. `pnpm turbo typecheck --silent` (strikt typkontroll utan fel)
2. `pnpm turbo lint --silent` (eslint-plugin-boundaries för modulgränser)
3. `pnpm turbo test --silent` (isolerade enhetstester)
4. `pnpm test:emu` (integrationstester mot Firebase Emulator Suite)
5. `pnpm test:e2e` (Playwright på Desktop 1280×800 samt Mobile 375×667 & 390×844)

---

## 5. Hierarkisk kontext & Fördjupning

För detaljerade riktlinjer inom specifika områden ska agenten konsultera följande filer:
* **Frontend & Mobil UI:** [prototype-sandbox/AGENTS.md](file:///c:/temp/Antigravity/Öhlundsfröer/prototype-sandbox/AGENTS.md) (eller `apps/web/AGENTS.md`)
  * Mobile-first (360px+), 44px touch-ytor, 100dvh, klippskydd för Å/Ä/Ö, toast-principen (anti-screen theft) och persistent varukorg i `localStorage`.
* **Designsystem & Profil:** [docs/design-system.md](file:///c:/temp/Antigravity/Öhlundsfröer/docs/design-system.md)
  * Färgpalett (Tallgrön, Havre, Terrakotta), typsnittshierarki, grodd-Ö logotypen och fotoregler.
* **Komplett Utvecklarguide:** [docs/dev_guide.md](file:///c:/temp/Antigravity/Öhlundsfröer/docs/dev_guide.md)
  * Sammanfattning av affärslogik, fraktklasser, kampanjkodsmotor, cookie-strategi (bannerfritt) och lärdomar från prototypfasen.
* **Modulregler:** `packages/modules/<modul>/AGENTS.md` (specifika regler för inventory, finance, fulfillment etc.).
