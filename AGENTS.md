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

---

## 3. Deterministisk Verifieringsloop (Låt kompilatorn styra)

En agent får aldrig gissa eller hallucinera att kod fungerar. Innan en uppgift anses klar **MÅSTE** verifieringsloopen köras i terminalen med noll fel:

```
[Agent skriver kod] 
        ↓
1. `npm run typecheck` (strikt TypeScript-kompilering, tsc --noEmit)
        ↓ (OK)
2. `npm run lint` (kontroll av arkitekturgränser via eslint-plugin-boundaries)
        ↓ (OK)
3. `npm run test` (enhets- och kontraktstester mot emulatorer)
        ↓ (OK)
[Koden godkänd]
```

**Krav före slutförd uppgift:**
En agent får **INTE** markera en uppgift som klar utan att ha kört och fått grönt ljus (noll fel) på:
1. `npm run typecheck` (strikt TypeScript-kompilering)
2. `npm run lint` (kontroll av arkitekturgränser via boundaries)
3. `npm run test` (enhets- och kontraktstester mot emulatorer)

Om något steg fallerar ska agenten själv korrigera koden och köra loopen igen tills den är grön.

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

---

## 6. Domänspecifika regler för Öhlundsfröer

### Fraktklasser & Fraktsmart merförsäljning
* Varje SKU har en strikt fraktklass:
  * `FLAT_LETTER`: Platta och lätta artiklar (fröpåsar, etiketter, såband). Max brevporto (29 kr, fri frakt över 350 kr).
  * `BULKY_PARCEL`: Skrymmande artiklar (vaser, krukor, jord, knölar). Paketfrakt till ombud (79 kr).
* Kassan och varukorgsrekommendationer **måste respektera fraktklasserna**:
  * Om en varukorg enbart har `FLAT_LETTER` får merförsäljningsmotorn **inte** föreslå `BULKY_PARCEL` utan tydlig varning till kunden om ändrat fraktpris.

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
