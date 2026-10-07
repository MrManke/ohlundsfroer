# Utvecklarguide & Arkitekturhandbok: Öhlundsfröer
## Från Prototyp & Utforskning till Produktion (Next.js 16 + Firebase + Stripe)

> **Syfte med detta dokument:**  
> Detta dokument sammanfattar alla insikter, tekniska beslut, designmönster och "hårda lärdomar" som vi utforskat och validerat i prototypfasen. Den fungerar som en komplett **Dev Guide** och hand-off-specifikation för alla utvecklare och AI-agenter när produktionssystemet (`apps/web` och `packages/modules/*`) driftsätts.

---

## 1. Vision & Varumärkesidentitet

Öhlundsfröer är ett modernt e-handelsbolag med säte vid **Öhlunds Brygga vid Ljusnans strand i Ljusdal (Odlingszon 5, Hälsingland)**.
Bolaget förenar tre unika styrkor:
1. **Industriell logistik & processtyrning** (snabb, fraktsmart distribution, automatiserade brevflöden).
2. **Sortimentskänsla & ekoodling** (provodlade snittblommor, dahlior och kulturarvsgrönsaker anpassade för tuffare klimat, 100 % giftfritt).
3. **Robust systemarkitektur & lokalt hantverk** (modern molnarkitektur, automatisk spårbarhet via QR-koder och handbyggda odlingsbäddar och blomsterkiosk).

### Varumärkets Design- & Formspråk
* **Färgpalett (Skandinavisk natur & hantverk):**
  - **Tallgrön (`#1B2A20`):** Primär varumärkesfärg, rubriker, logotyp, kontrastfärg.
  - **Havre (`#F7F5EE`):** Primär bakgrundsfärg. Ger en varm, mjuk pappers- och linnekänsla. Kritvitt `#FFFFFF` används sparsamt och uteslutande på lyfta kort och modaler.
  - **Terrakotta (`#C66B4E`):** Primär CTA-accent (*"Köp fröer"*, *"Gå till kassan"*, prisframhävning).
  - **Bränd lera (`#A85237`):** Hover-läge för terrakotta.
  - **Linne / Sand (`#E8E2D5`):** Subtila avdelare, ramar och bakgrundsplattor.
  - **Bark (`#26231F`):** Primär textfärg för maximal läsbarhet (kontrast > 4.5:1).
* **Typografi:**
  - **Editorial / Storytelling:** Serif (*Newsreader* eller *Playfair Display*). Används för rubriker, sortnamn, bukettrecept och historiska sektioner.
  - **UI / Fakta / Siffror:** Sans-serif (*Plus Jakarta Sans* eller *Inter*). Används för priser, knappar, filter, såtabeller och kassa.
* **Logotyp:**
  - Den officiella logotypen är ett grodd-Ö (`ohlunds_sprout_logo.svg`) med två distinkta blad spirande från ringens ovansida – identisk med trycket på de fysiska kraftpåsarna.
* **Autentiska bilder framför mockups:**
  - Hjälte- och profilsektioner ska uteslutande använda användarens autentiska fotografier (`ohlunds_brygga_panoramic.jpg`, foton från Stugan och odlingarna). Genererade AI-mockups får aldrig ersätta verkligheten.

---

## 2. Frontend- & Mobilarkitektur (Mobile-First Lärdomar)

Under prototypbyggandet identifierades och löstes flera subtila men avgörande mobilproblem. Dessa regler är **järnhårda** för frontend-utvecklingen:

### 2.1 Typografi & Klippskydd (Å, Ä, Ö)
* **Förbud mot `leading-none` på rubriker:** Display- och serif-typsnitt som innehåller svenska bokstäver (Å, Ä, Ö) klipper diakritiska prickar och ringar mot överkanten om `leading-none` används.
  - **Krav:** Använd alltid minst `leading-tight` eller `leading-snug` i kombination med `pt-1` eller `py-1` i luft på titlar.
* **Flexibla containerhöjder:** Fasta containerhöjder (t.ex. `h-20`) riskerar att kväva logotypen på mobiler. Använd responsiva höjder som `h-16 sm:h-20`.

### 2.2 Mobilnavigering & Ergonomi
* **Horisontell snabbnavigering (Quick-Nav):**
  - En rullbar rad med tumvänliga piller direkt under headern (`Fröer`, `Bukettrecept`, `Odla i Zon 5`, `Om oss`) ger direkt 1-klicksåtkomst till butikens kärnsektioner utan att behöva öppna en separat hamburgarmeny.
  - Sociala kanaler (Instagram, TikTok, YouTube) och fördjupande information placeras i sajtens footer.
* **Ingen automatisk fullskärmsöppning av varukorg vid köp (Anti-Screen Theft):**
  - Att automatiskt skjuta ut varukorgs-drawern eller en modal när kunden klickar "Köp fröer" bryter flödet och tvingar kunden att stänga panelen manuellt varje gång.
  - **Rätt mönster:** Visa en diskret toast i skärmens underkant:  
    `✓ Luktärt 'Morgonbris' lades till i korgen [Öppna varukorg]`  
    Detta låter kunden fortsätta bläddra och handla ostört.

### 2.3 Varukorgs-Drawer & Vertical Real Estate
* **Full bredd på mobil:** Sidopaneler ska expandera till `w-full` på skärmar under 640 px (ta bort hårda marginaler som `pl-10`).
* **Dynamisk viewporthöjd (`100dvh`):** Använd `h-[100dvh]` istället för `100vh` för att förhindra att knappar kapas bakom mobilens adressfält.
* **Prioriterad artikellista:** Artikellistan MÅSTE ha `flex-1 min-h-0 overflow-y-auto`. Fasta element (fri frakt-mätare, tips och kassaknapp) får aldrig kväva artiklarna.
* **Touch-ergonomi & Radbrytning:**
  - Knappar och åtgärder som *"Ta bort"* ska ha `whitespace-nowrap` så att ord inte delas på två rader.
  - Touch-ytor ska vara minst 44×44 px.
  - Snabbjustering av antal (`[-] qty [+]`) ska finnas direkt på artikelkortet.

### 2.4 Beständighet & Tillstånd (Persistent State)
* **Varukorgen sparas i `localStorage`:** Varukorg och eventuellt applicerad kampanjkod synkas mot `localStorage`. Vid oavsiktlig sidomladdning (F5) eller navigering mellan sidor förlorar kunden inte sina varor.

---

## 3. Affärslogik, Frakt & Kampanjer

### 3.1 Fraktklasser & PostNord-optimering
Systemet differentierar produkter i två strikta fraktklasser:
1. **`FLAT_LETTER` (Brevfrakt 29 kr):**
   - Platta och lätta artiklar (fröpåsar, etiketter, såband).
   - Levereras direkt i brevlådan.
   - **Fri brevfrakt vid köp över 350 kr.**
2. **`BULKY_PARCEL` (Paketfrakt 79 kr):**
   - Skrymmande artiklar (vaser, krukor, jord, större rotknölar).
   - Levereras spårbart till PostNord-ombud.
   - **Omfattas inte av fri frakt.**

### 3.2 Fri frakt-beräkning & presentation
* När kunden uppnår fri fraktgränsen (>= 350 kr) ska gränssnittet tydligt differentiera brev och paket:
  - Vid ren brevorder: Framstegsmätaren visar *"Du har kvalificerat dig för FRI BREVFRAKT!"*, notisen visar *"✓ Fri brevfrakt (0 kr – direkt i brevlådan)"* och totalsummeringen visar *"Frakt: 0 kr (Fri brevfrakt)"*.
  - Vid skrymmande paketorder: Framstegsmätaren informerar *"Skrymmande varor i korgen (Paketfrakt 79 kr via ombud – fri frakt gäller endast brevorder)"* och totalsummeringen visar *"79 kr (Paket till ombud)"*.

### 3.3 Kampanj- & Rabattkodsmotor
Varukorgen har ett dedikerat, diskret fält: `+ Ange rabattkod eller presentkort`.
Stöder tre rabatttyper:
* **Procentuell rabatt (`PERCENT`):** T.ex. `VÅR2026` (10%), `LJUSDAL` (15%). Beräknas på varornas delsumma.
* **Fast beloppsrabatt (`FIXED`):** T.ex. `BRYGGAN` (25 kr avdrag).
* **Fri frakt-kampanj (`FREE_SHIPPING`):** T.ex. `FRIFRAKT` (sätter portot till 0 kr oavsett ordervärde).

### 3.4 Produktkortsdifferentiering (`ProductType`)
Varje artikel i katalogen styrs av ett strikt enum som avgör kortets layout och köpknapp:
1. `seed` (Fröpåsar): Visar såmånader, odlingszoner, planthöjd och länk till mobil odlingsguide. CTA: *"Köp fröer"*.
2. `tuber` (Knölar & Rotstockar, t.ex. dahlia): Visar frostriskinformation och leveransfönster (`shipWindow: { startMonth: 3, endMonth: 5 }`). Får **aldrig** visa QR-kod till fröguide. CTA: *"Köp knöl"*.
3. `accessory` / `lifestyle` (Trämärketiketter, vaser, fakirer): Visar material och specifikationer. CTA: *"Köp tillbehör"*.
4. `bouquet_bundle` (Virtuella bukettpaket): Visar paketpris, ordinarie pris och ingående frösorter. CTA: *"Köp paketet"*.

### 3.5 Blandad varukorg & Leveransfönster
* Om en order innehåller både fröer med omedelbar leverans och dahliaknölar med framtida leveransfönster (april), ska systemet som standard sätta sändningsdatum till det **senaste gemensamma leveransdatumet**. Delad sändning erbjuds endast som betalt tillval.

---

## 4. Riktlinjer för Cookies & Juridik (GDPR / PTS)

### "Måste man ha en cookie-banner?"
**Svar: NEJ, inte om vi bygger rätt.**
* **Lagkravet (ePrivacy / PTS Kaklag):** Samtyckesbanner krävs **endast** för icke-nödvändiga kakor (spårning, profilering, Google Ads, Meta Pixel).
* **Nödvändig funktionalitet är undantagen:** Att spara varukorgen i `localStorage` eller hantera betalningssessionen är tekniskt nödvändigt för tjänsten och kräver **inget samtycke**.
* **Strategiskt beslut för Öhlundsfröer:**
  - Vi kör **banner-fritt**! Det ger en fantastiskt ren, snabb och proffsig upplevelse på mobilen.
  - I footern under *Köpvillkor & Integritet* anges kort:  
    > *"Vi använder endast funktionell lokal lagring för att komma ihåg din varukorg. Vi säljer inga data och använder inga spårningskakor från tredje part."*

---

## 5. Systemarkitektur & Modulstruktur (Backend & Transaktioner)

Systemet implementeras som en **modulär monolit** i TypeScript:

```text
packages/
└── modules/
    ├── catalog/        # Produkter, SKU:er, kategorier, odlingsdata, bukettpaket
    ├── orders/         # Varukorg, kassa, frysta ordrar, tillståndsmaskin
    ├── payments/       # Stripe Checkout, webhooks, återbetalningar
    ├── inventory/      # Flerdimensionellt saldo, TTL-reservationer, buckets
    ├── fulfillment/    # Plocklistor, FEFO-tilldelning av lot, PostNord-export
    ├── procurement/    # EU-inköp, bulksändningar, EU-moms
    ├── production/     # Ompackning bulk till kraftpåsar vid Bryggan, lot-kedja
    ├── finance/        # Immutabla verifikationer (finance_entries), SIE4-export
    └── notifications/  # Resend-mailmallar, lagerbevakning, orderbekräftelser
```

### Järnhårda arkitekturregler:
1. **Modulinkapsling:** Enda tillåtna publika ytan är `src/index.ts`. Allt under `src/internal/**` är privat.
2. **Databas-isolering:** Varje modul äger sina egna Firestore-samlingar (t.ex. `inventory_skus`, `finance_entries`). Direktskrivningar över modulgränser är förbjudna.
3. **Pengar i öre:** Alla belopp sparas uteslutande som heltal i öre (`amountInCents`). Flyttal för valuta är strängt förbjudet.
4. **Lagersaldo & ACID:** Alla saldoförändringar och reservationer MÅSTE ske i en Firestore-transaktion (`runTransaction`). `FieldValue.increment` är förbjudet utan föregående disponibilitetskontroll.
5. **Atomisk bukettreservation (All-or-Nothing):** Ett bukettpaket reserveras som en enda atomär transaktion. Saknas saldo på en enda ingående frösort rullas hela reservationen tillbaka.
6. **30 minuters TTL:** Varukorgsreservationer har en strikt 30-minuters TTL och återförs automatiskt till disponibelt saldo om kassan överges.
7. **Idempotens & Triggers:** Alla Cloud Functions / bakgrundshändelser körs med `{ retry: true }` och sparar unikt `eventId` för att garantera idempotens.

---

## 6. Automatiserad Test- & Verifieringsloop

Ingen kod får slås samman eller driftsättas utan att verifieras deterministiskt:

```text
1. npm run typecheck  (tsc --noEmit, strikt TypeScript)
2. npm run lint       (eslint-plugin-boundaries för modulgränser)
3. npm run test       (isolerade enhets- och beräkningstester)
4. npm run test:emu   (integrationstester mot Firebase Emulator Suite)
5. npm run test:e2e   (Playwright: Desktop 1280×800 samt Mobile 375×667 & 390×844)
```

### Mekaniska kontroller i Playwright:
* **Noll horisontell overflow:** Kontrollera `document.documentElement.scrollWidth <= window.innerWidth`.
* **Klippskydd:** Verifiera att rubriker och logotyp med Å/Ä/Ö inte klipps i överkant.
* **Köpbeteende:** Klick på köpknapp visar toast utan att stänga ner katalogen.
* **Rullningsbarhet:** Varukorgens artikellista är fullt läsbar och rullningsbar på mobilskärmar (375×667) utan ordavhuggning.
