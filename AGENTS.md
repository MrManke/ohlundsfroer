# AGENTS.md – Utvecklings- & Arkitekturregler för AI-agenter
## Projekt: Öhlundsfröer / Öhlunds Brygga (Ljusdal, Hälsingland)

> Denna fil sätter de absoluta spelreglerna för alla AI-kodagenter som arbetar i detta repository.
> Överträdelser mot dessa regler accepteras inte och stoppas mekaniskt av automatiserade tester och linters i CI/CD.

---

## 1. Huvudarkitektur & Domänstruktur

Systemet är en **modulär monolit** skriven uteslutande i **TypeScript**. Koden körs i Next.js 16 (App Hosting) och Cloud Functions v2 (Node.js 24), med datalagring i Cloud Firestore och betalningar via Stripe.

### Moduler i `packages/modules/`
1. `catalog` – Produkter, SKU:er, kategorier, odlingsdata, bukettpaket (virtuella paket), säsongsfönster.
2. `orders` – Varukorg, kassa, frysta ordrar, tillståndsmaskin.
3. `payments` – Stripe Checkout, webhooks, återbetalningar.
4. `inventory` – Flerdimensionellt saldo (fysiskt, reserverat, disponibelt), tidsbegränsade reservationer (TTL), bucket-reservationer för drops, lotnummer.
5. `fulfillment` – Plocklistor, FEFO-tilldelning av lot vid pack, fraktbokning, CSV-export, spårning, returer.
6. `procurement` – Inköp från leverantörer (EU-import till Ljusdal), inkommande bulksändningar, EU-momsdata.
7. `production` – Linjär ompackning (`production_runs`: bulk till påse vid Bryggan), lot-kedja.
8. `finance` – Oföränderlig verifikationsjournal (`finance_entries`), SIE4- och CSV-export (Fortnox-kompatibel).
9. `notifications` – E-postmallar (Resend), lagerbevakning, orderbekräftelser.

---

## 2. Järnhårda arkitekturregler (Guardrails)

### Regel 2.1: Strikt modulinkapsling
* Varje modul i `packages/modules/<modul>` har:
  * `src/index.ts` – **DEN ENDA TILLÅTNA PUBLIKA YTAN**. Exporterar endast Zod-kontrakt, TypeScript-typer och publika servicemetoder.
  * `src/internal/**` – All intern domänlogik, databasåtkomst och hjälpfunktioner.
* **FÖRBJUDET:** En agent får **ALDRIG** importera från en annan moduls `internal/`-katalog eller exportera interna hjälpare i `index.ts`. Detta kontrolleras mekaniskt av `eslint-plugin-boundaries`.

### Regel 2.2: Isolerad datatillgång i Firestore
* Varje modul äger sina egna Firestore-samlingar med ett unikt prefix (t.ex. `catalog_products`, `orders_records`, `inventory_skus`, `finance_entries`).
* **FÖRBJUDET:** En modul får **ALDRIG** läsa från eller skriva till en annan moduls samlingar. All datainteraktion sker via den ägande modulens publika API eller via händelser.

### Regel 2.3: Kontraktstyrning via Zod
* All data som korsar modulgränser eller API-endpoints **MÅSTE valideras med Zod-scheman** i runtime.
* Scheman definieras i respektive moduls publika export eller i `packages/shared`.
* Befintliga Zod-scheman får **INTE ändras så att de bryter bakåtkompatibilitet** utan en explicit godkänd migrationsplan.

### Regel 2.4: Transaktioner & Saldosäkerhet (ACID)
* Lagerreservationer och saldominskningar **MÅSTE ALLTID** ske inuti en atomisk Firestore-transaktion (`runTransaction`).
* `FieldValue.increment` får ALDRIG användas utan att disponibelt saldo först har kontrollerats i en transaktion.
* Reservationer har en strikt TTL (Time-To-Live, standard 30 min för kassa).

### Regel 2.5: Händelser och Triggers (Retry & Idempotens)
* Alla bakgrundshändelser och Firestore-triggers **MÅSTE** definieras med `{ retry: true }` (använd alltid den centrala hjälparen `defineTrigger()`).
* Eftersom händelser kan levereras mer än en gång (*at-least-once*) **MÅSTE alla händelsehanterare vara idempotenta** genom att kontrollera och spara ett unikt `eventId`.

### Regel 2.6: Obligatorisk testtäckning & regressionsskydd
* **Ingen kod utan tester:** Varje ny domänmetod, affärsregel, API-rutt eller buggfix MÅSTE åtföljas av relevanta automatiserade tester. Kod utan tillhörande tester godkänns inte.
* **Förbud mot testmanipulation:** En agent får ALDRIG inaktivera (`test.skip`), kommentera bort eller sänka kraven i befintliga tester för att få en körning grön. Ett fallerande test är alltid en regression som måste lösas i applikationskoden.
* **Teststruktur:**
  * Enhetstester ska ligga intill koden de testar (`*.test.ts`).
  * Integrationstester mot Firebase Emulator Suite placeras i respektive moduls `test/integration/`.
  * E2E-flöden placeras i `/tests/e2e/`.

### Regel 2.7: Responsivitet & god tillgänglighet (WCAG AA)
* **Mobile-First & Responsivitet:** All design ska byggas med mobilt gränssnitt som bas (från 360 px) och skalas uppåt med Tailwind (`sm:`, `md:`, `lg:`). Horisontell sidscroll är förbjuden. Interaktiva touchytor på mobil ska vara minst 44×44 pixlar.
* **Tillgänglighetsstandard (WCAG 2.1/2.2 AA):** Även om mikroföretag juridiskt är undantagna från Tillgänglighetsdirektivet ska systemet byggas ergonomiskt för kunder i solljus och med synnedsättningar:
  * Semantisk HTML5 (`<main>`, `<nav>`, `<button>`, `<article>`) – generiska `<div>`/`<span>` för klickbara element är förbjudna.
  * Informativa `alt`-texter på produktbilder och odlingsillustrationer.
  * Full funktionalitet med enbart tangentbord (Tab, Enter, Space, Escape) samt tydlig fokusram (`focus-visible`).

---

## 3. Deterministisk Verifieringsloop (Låt kompilatorn styra)

En agent får aldrig gissa eller anta att kod fungerar. Innan en uppgift markeras som klar MÅSTE verifierings- och regressionssviten köras i terminalen och returnera noll fel:

```
[Agent skriver kod + tester]
        ↓
1. `npm run typecheck` (tsc --noEmit, strikt typkontroll)
        ↓ (OK)
2. `npm run lint`      (eslint-plugin-boundaries för modulgränser)
        ↓ (OK)
3. `npm run test`      (isolerade enhets- och beräkningstester)
        ↓ (OK)
4. `npm run test:emu`  (integrationstester mot Firebase Emulator Suite)
        ↓ (OK)
[Uppgiften godkänd]
```

### 3.1 Teststandarder per nivå

#### 1. Enhetstester (Snabb affärslogik)
* **Omfattning:** Alla Zod-kontrakt, prisberäkningar i öre, fraktklassregler (`FLAT_LETTER` vs `BULKY_PARCEL`), momskalkyler, zon- och månadsfilter (`zones`, `sowMonths`).
* **Krav:** 100 % isolerade från nätverk och databaser. Körs på millisekunder.

#### 2. Integrationstester (Emulator & Transaktionssäkerhet)
* **Omfattning:**
  * **Lagersaldo & ACID:** Samtidighetstester där 20–50 parallella anrop försöker reservera de sista enheterna av en SKU eller ett bukettpaket – exakt rätt antal ska lyckas och resten nekas utan översäljning.
  * **TTL & Task Queue:** Säkerställ att utgångna reservationer (30 min) automatiskt återförs till disponibelt saldo.
  * **Idempotens:** Verifiera att triggning av samma `eventId` två gånger inte duplicerar verifikationer i `finance_entries` eller skickar dubbla mail.
* **Miljö:** Körs uteslutande mot lokal Firebase Emulator Suite.

#### 3. E2E & Regressionssvit (Playwright)
* **Kritiska flöden:**
  * Bygga bukettpaket → lägga i korg → kontrollera fraktklass → slutföra mockad kassa → verifiera fryst orderstatus och uppdaterat lagersaldo.
  * Blandad varukorg (fröer + dahlia med framtida leveransfönster) för att säkerställa att sändningsdatum sätts till det senaste gemensamma datumet.

---

## 4. Subagenter och Personas

Arbetet fördelas mellan specialiserade subagenter med anpassad risktolerans:

### Subagent A: Transaction & Data Guardian (Hög paranoia)
* **Fokus:** Inventory, Orders, Payments, Firestore ACID-transaktioner.
* **Regler:**
  - Får aldrig skriva asynkron eller icke-transaktionell logik för saldoförändringar.
  - Måste alltid använda `runTransaction` och spara `eventId`.
  - Måste alltid verifiera samtidighetstest (t.ex. 20 samtidiga anrop mot samma lagersaldo i emulatorn).

### Subagent B: Frontend & UI Specialist (Hög kreativitet & UX)
* **Fokus:** Next.js 16, Tailwind CSS, användarupplevelse, bukettbyggaren, mobilt gränssnitt.
* **Regler:**
  - **FÖRBJUDET:** Inga Firebase Admin SDK- eller serverbibliotek får någonsin importeras i klientsidans kod (`"use client"`).
  - Får aldrig anropa Firestore direkt från React-komponenter i butiken.
  - Kassa, reservationer och betalningsinitiering ska uteslutande ske via Next.js Server Actions eller definierade API-rutter.
  - Arbetar uteslutande mot Zod-scheman och Server Actions / definierade endpoints.
  - Strikt följsamhet till Öhlunds designsystem (inga layout-shifts, god tillgänglighet).

### Subagent C: Spec & Contract Reviewer (Gatekeeper)
* **Fokus:** Zod-scheman och API-kontrakt i `packages/shared`.
* **Regler:**
  - Kontrollerar diff mot befintliga scheman.
  - Stoppar bygget om en ändring bryter bakåtkompatibilitet.

---

## 5. Designsystem & Profilregler (Öhlunds Brygga)

### Färgpalett
* **Tallgrön (`#1B2A20`):** Primär varumärkesfärg, rubriker, mörkgrön kontrast, logotyp.
* **Havre (`#F7F5EE`):** Primär bakgrundsfärg. Skapar en mjuk pappers- och linnekänsla. Kliniskt kritvitt `#FFFFFF` på stora bakgrundsytor är förbjudet.
* **Terrakotta (`#C66B4E`):** Accentfärg och primär CTA (t.ex. *"Köp buketten"*, *"Gå till kassan"*).
* **Bränd lera (`#A85237`):** Hover-läge för terrakotta.
* **Linne / Sand (`#E8E2D5`):** Ramar, subtila avdelare och kortkanter.
* **Bark / Trä (`#26231F`):** Primär textfärg för brödtext.

### Typografi
* **Editorial / Storytelling:** Serif (*Newsreader* eller *Playfair Display*). Används för rubriker, sortnamn, bukettrecept och herotext.
* **UI / Odlarfakta:** Sans-serif (*Plus Jakarta Sans* eller *Inter*). Används för priser, knappar, såtabeller, filter och kassa.

### QR-kodstandard & Mobilguide ("Odla-vy")
* På baksidan av varje fysisk fröpåse trycks en QR-kod (jämte växtpass och lotnummer).
* QR-koden länkar alltid till en permanent URL: `/q/<sku>` eller `/froer/<slug>?ref=qr`.
* URL:en leder till en snabbladdad mobiloptimerad "Odla-vy" för trädgårdsodlaren vid pallkragen:
  - Tydliga ikoner för sådjup, plantavstånd, förkultivering/direktsådd.
  - Odlingstips anpassade för **Zon 5 / Ljusdal och kallare klimat**.
  - Skörde- och snittblomstips för långt vasliv.

### Tillgänglighet & Kontrast (Synfel & Färgblindhet)
* **Kontrastkrav (minst 4.5:1):**
  * All text mot den ljusa Havre-bakgrunden (`#F7F5EE`) ska använda Tallgrön (`#1B2A20`) eller Bark (`#26231F`).
  * Knappar i Terrakotta (`#C66B4E`) med vit text ska kontrastsäkras (använd `#B8583B` vid behov för att uppnå 4.5:1).
* **Färgredundans (Färgblindhet):** Information får aldrig förmedlas enbart med färg:
  * Lagerstatus ska kombinera ikon/symbol och text (t.ex. diskret bock + "I lager", "Slutsåld").
  * Odlingszoner och fraktklasser ska alltid anges i tydlig text och med symboler (t.ex. kuvert/brev, paket för skrymmande).
* **Skärmläsare och dynamiska ytor:**
  * Slide-out-varukorgen ska fånga tangentbordsfokus vid öppning och släppa det vid stängning.
  * Dynamiska uppdateringar (t.ex. fri frakt-mätaren: *"Handla för 45 kr till för fri frakt"*) ska annoteras med `aria-live="polite"`.

### UI-minimalism & Förbud mot emoji-kladd
* **FÖRBJUDET med färgglada standard-emojis i UI:** Standard-emojis (såsom 🔍, 🌱, ✉️, 📦, 🌸, 🔔, 🌾, 📱, 🛒) får **INTE** användas som ikoner på knappar, badgar, toast-meddelanden eller i rubriker. De ger ett oseriöst, gammalmodigt och "kladdigt" intryck.
* **Modern skandinavisk stil:** Använd istället ren typografi, diskreta mikroetiketter eller minimalistiska monokroma SVG-ikoner i varumärkets färgskala (Tallgrön, Terrakotta eller Bark).
* **Inga störande overlays eller zoom-knappar:** Överlägg som t.ex. rutor med "Förstora bild", knappar märkta "Detaljzoom (2x)" eller flytande tooltips som "Klicka på bilden för att förstora" är **strängt förbjudna**. Använd istället rena klickinteraktioner och naturlig musmarkör (`cursor-pointer`).
* **Varumärkeslogotyp (Sprout-Ö):** Den officiella logotypen är ett grodd-Ö (`ohlunds_sprout_logo.svg`) med två distinkta blad spirande från ringens ovansida. Varianter med yttre cirklar, standby-symboler eller inverterade snitt är ogiltiga.

### Förpacknings- & Bildintegritet
* **Enhetliga kraftpåsar:** Alla fröpåsar ska avbildas i varumärkets bruna papperskraftpåsar med Tallgrönt tryck. Vita papperskuvert eller blank plast är förbjudet i produktkatalogen.
* **Strikt textmatchning:** Texten och sortnamnet på den avbildade påsen MÅSTE matcha produktens titel i katalogen (t.ex. får en bild med texten "Slöjsilja" aldrig användas för körsbärstomater).
* **Sanningsenliga produktbilder:**
  * Tillbehör (`accessory`) ska avbilda den faktiska produkten (t.ex. trämärketiketter i sin kraftgördel), aldrig fröpåsar.
  * Knölar (`tuber`) ska visa faktiska rotknölar redo för vårplantering, inte enbart utslagna sommarblommor.

---

## 6. Domänspecifika regler för Öhlundsfröer

### Fraktklasser & Fraktsmart merförsäljning
* Varje SKU har en strikt fraktklass:
  * `FLAT_LETTER`: Platta och lätta artiklar (fröpåsar, etiketter, såband). Max brevporto (29 kr, fri frakt över 350 kr).
  * `BULKY_PARCEL`: Skrymmande artiklar (vaser, krukor, jord, knölar). Paketfrakt till ombud (79 kr).
* Kassan och varukorgsrekommendationer **måste respektera fraktklasserna**:
  * Om en varukorg enbart har `FLAT_LETTER` får merförsäljningsmotorn **inte** föreslå `BULKY_PARCEL` utan tydlig varning till kunden om ändrat fraktpris.

### Katalog- och kortdifferentiering per produkttyp (`ProductType`)
Varje produkt i katalogen tillhör en explicit `ProductType` som styr kortets layout, specifikationer och köpknappar:
1. `seed` (Fröpåsar):
   - Visar såmånader, odlingszoner och planthöjd.
   - Visar klickbar länk till "Se odlingsguide & QR-kod".
   - CTA-knapp: *"Köp fröer"*.
2. `tuber` (Knölar & Rotstockar, t.ex. dahlia):
   - Visar leveransfönster och frostriskvarning (`shipWindow`, t.ex. *"Leverans mars–maj"*).
   - Visar planteringsdjup och plantavstånd.
   - Får **INTE** visa fröodlingsguide eller fröpåse-QR-kod.
   - CTA-knapp: *"Köp knöl"* (eller *"Bevaka knöl"* vid slutförsäljning).
3. `accessory` & `lifestyle` (Prylar, trämärketiketter, vaser, fakirer):
   - Får **ALDRIG** visa QR-kod till odlingsguide eller såmånader.
   - Visar materiella specifikationer (t.ex. *"10-pack björkträ"*, *"Handdrejat stengods"*).
   - CTA-knapp: *"Köp tillbehör"* eller *"Köp vas"*.
4. `bouquet_bundle` (Virtuella bukettpaket):
   - Visar paketpris, ordinarie pris och sparad procentsats (*"Spara 15%"*).
   - Visar ingående frösorter och skördeperiod.
   - CTA-knapp: *"Köp paketet"*.

### Bukettpaket (Snittblomsrecept)
* Bukettpaket modelleras som **virtuella paket** i Catalog (`type: 'bouquet_bundle'`). De refererar till en uppsättning frö-SKU:er.
* I butiken kan kunden köpa hela paketet med rabatt eller bocka av sorter de redan har.
* **Atomär reservation (All-or-nothing):** Reservation av ett bukettpaket MÅSTE ske som en enda atomär operation i samma transaktion. Om en enda ingående artikel saknar saldo ska hela reservationen rullas tillbaka och ge ett tydligt domänfel. En agent får ALDRIG skriva en loop med separata reservationer.

### Leveransfönster & Blandad varukorg (shipWindow)
* Knölar (som dahlia) har `shipWindow: { startMonth: 3, endMonth: 5 }` pga frostrisk.
* **Standardregel för kassan:** Om en beställning innehåller produkter med olika `shipWindow` (t.ex. fröer med omedelbar leverans och dahliaknölar för april) ska kassan som standard sätta sändningsdatumet till den **senaste gemensamma leveransdagen**.
* **Delad leverans:** Får endast aktiveras om kunden aktivt väljer det som ett betalt tillval med separat fraktavgift. Agenten får inte bygga split-logik på eget bevåg.

### Bokföring & Ekonomi (Finance)
* Poster i `finance_entries` är **oföränderliga** (immutable). De får aldrig uppdateras eller raderas; felaktigheter korrigeras uteslutande med en motbokning.
* Export sker via SIE4 (verifikationer) och CSV.

---

## 7. Hierarkisk AGENTS.md-struktur

* `/AGENTS.md` (denna fil): Globala regler, arkitektur, designsystem och verifieringsloop.
* `/apps/web/AGENTS.md`: Lokala frontend-regler (Next.js, Server Actions, tillgänglighet, ingen direkt Firebase SDK-åtkomst).
* `/packages/modules/inventory/AGENTS.md`: Lokala transaktions- och saldoregler (ACID, TTL, bucket-reservation).
* `/packages/modules/fulfillment/AGENTS.md`: Lokala pack-, lot- och fraktregler (FEFO, CSV-format).

---

## 8. Token-optimering & Agent-ekonomi (Frugal Engineering)

För att hålla nere tokenförbrukningen och säkerställa snabba, kostnadseffektiva agentcykler gäller följande regler:
1. **Kirurgiska ändringar (Surgical diffs):** Använd alltid `replace_file_content` för precisa kodblock framför att skriva om hela filer. Skriv aldrig om filer på flera hundra rader när endast 5 rader ändras.
2. **Selektiv testkörning:** Kör inte hela emulator- och E2E-sviten vid enkla komponentändringar. Kör enhetstester mot den specifika filen först:
   ```bash
   npx vitest run path/to/file.test.ts
   ```
3. **Kompakt kommandoutdata:** Använd tysta flaggor (`--silent`, `--quiet`) i CLI-verktyg för att förhindra att tusentals rader terminaloutput fyller agentens kontextfönster.
4. **Tillgångsdisciplin:** Undvik onödiga externa API-anrop när lokala verktyg (t.ex. Python PIL för bildmanipulering, SVG-vektorer) löser uppgiften deterministiskt och utan token- eller API-kostnad.
5. **Subagent-isolering:** Vid komplexa uppgifter, isolera domänundersökningar till specialiserade personas så att inte hela projektets historik laddas in i varje enskild agentkonversation.
