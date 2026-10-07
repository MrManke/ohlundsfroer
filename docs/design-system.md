# Designsystem & Profilhandbok: Öhlunds Brygga

> Detta dokument utgör den fullständiga design- och varumärkesreferensen för Öhlundsfröer och Öhlunds Brygga (Ljusdal, Hälsingland).
> Frontend-agenter läser detta vid behov för djupare förståelse av stil, komponenthierarki och visuell identitet.

---

## 1. Varumärkesessens & Känsla

Öhlundsfröer förenar det jordnära hantverket från trädgårdsodlingen vid Ljusnans strand med modern industriell precision och logik.
* **Känslan:** Varm, personlig, skandinaviskt naturlig och professionell.
* **Inget "kladd":** Färgglada standard-emojis (🌱, 🌸, 📦 etc.) är strängt förbjudna i UI. Vi använder ren typografi och minimalistiska monokroma SVG-ikoner i varumärkets färgskala.
* **Autenticitet:** Autentiska fotografier från Stugan och odlingarna (`ohlunds_brygga_panoramic.jpg`) ska alltid användas framför genererade mockups.

---

## 2. Färgpalett & Tailwind-tokens

Färgerna definieras i `tailwind.config.ts` och ska alltid refereras via dess klassnamn (hårdkoda aldrig HEX-koder i komponenter):

| Namn | HEX | Tailwind-klass | Användningsområde |
| :--- | :--- | :--- | :--- |
| **Tallgrön** | `#1B2A20` | `bg-pine` / `text-pine` | Primär varumärkesfärg, logotyp, display-rubriker, mörk kontrast. |
| **Tallgrön Ljus** | `#2C4233` | `bg-pine-light` / `text-pine-light` | Hover-läge för tallgrön, aktiva tillstånd. |
| **Havre** | `#F7F5EE` | `bg-oat` / `text-oat` | Primär bakgrundsfärg. Mjuk linne- och papperskänsla. |
| **Terrakotta** | `#C66B4E` | `bg-terracotta` / `text-terracotta` | Primär CTA (*"Köp fröer"*, *"Gå till kassan"*), priser. |
| **Bränd lera** | `#A85237` | `bg-clay` / `text-clay` | Hover-läge för terrakotta. |
| **Sand / Linne** | `#E8E2D5` | `bg-sand` / `border-sand` | Ramar, subtila avdelare, kortkanter. |
| **Sand Ljus** | `#F0EBE1` | `bg-sand-light` | Mjuka bakgrundsplattor, badge-bakgrunder. |
| **Bark** | `#26231F` | `text-bark` | Primär textfärg för brödtext (kontrast > 4.5:1 mot havre). |

---

## 3. Typografi & Teckenintegritet

### Typsnittshierarki
1. **Editorial & Storytelling (Serif):** *Newsreader* eller *Playfair Display*.
   - Används för: Huvudrubriker (`h1`, `h2`), sortnamn, bukettrecept och historiska citat.
2. **UI & Fakta (Sans-serif):** *Plus Jakarta Sans* eller *Inter*.
   - Används för: Brödtext, priser, knappar, filter, såtabeller och kassa.

### Klippskydd för svenska tecken (Å, Ä, Ö)
* **Förbud mot `leading-none`:** Display-serif med å/ä/ö klipper armar och prickar mot överkanten om radavståndet är noll.
* **Regel:** Använd alltid `leading-tight` eller `leading-snug` och se till att containern har minst `pt-1` eller `py-1` i luft.

---

## 4. Officiell Logotyp: Grodd-Ö:et

Den officiella logotypen (`ohlunds_sprout_logo.svg`) är ett harmoniskt **Ö** där de två prickarna ersatts av två spirande blad:
* Identisk med trycket på de fysiska bruna kraftpåsarna vid Öhlunds Brygga.
* Får inte modifieras med yttre cirklar, standby-symboler eller inverterade snitt.

---

## 5. Produktkort & Sortimentsdifferens (`ProductType`)

Alla kort i katalogen ska styras av dess `ProductType`:
1. `seed` (Fröpåsar):
   - Visar såmånader, odlingszoner, planthöjd och länk till mobil odlingsguide.
   - Avbildas uteslutande i bruna kraftpåsar med korrekt sorttitel.
   - CTA: *"Köp fröer"*.
2. `tuber` (Knölar, t.ex. dahlia):
   - Visar frostriskinformation och leveransfönster (`shipWindow: mars–maj`).
   - Visar faktiska rotknölar redo för vårplantering.
   - Får **INTE** visa QR-kod till fröguide.
   - CTA: *"Köp knöl"*.
3. `accessory` / `lifestyle` (Etiketter, vaser, fakirer):
   - Visar material och fysiska mått (t.ex. *"10-pack björkträ"*).
   - Avbildar den faktiska prylen, aldrig en fröpåse.
   - CTA: *"Köp tillbehör"*.
4. `bouquet_bundle` (Virtuella bukettpaket):
   - Visar paketpris, ordinarie pris och sparad procent (*"Spara 15%"*).
   - Visar ingående frösorter och skördeperiod.
   - CTA: *"Köp paketet"*.

---

## 6. Mobil- & Varukorgsergonomi

* **Anti-Screen Theft:** Klick på köpknapp visar en diskret toast i botten (`✓ Luktärt 'Morgonbris' lades till i korgen [Öppna varukorg]`). Varukorgen får inte öppnas automatiskt.
* **Mobil Drawers:** `w-full sm:w-[430px]`, `h-[100dvh]`, och artikellistan ska alltid ha `flex-1 min-h-0 overflow-y-auto`.
* **Touch-ytor:** Minst 44×44 px på mobilen. Inline-ändring av antal (`[-] qty [+]`) direkt på artikelraden.
* **Ordavhuggning:** `whitespace-nowrap` på knappar och åtgärder som *"Ta bort"*.
