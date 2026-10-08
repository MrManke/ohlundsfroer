---
name: ohlunds-brygga-ecom
description: >-
  Komplett arkitektur- och affärsregelguide för Öhlunds Brygga (Öhlundsfröer).
  Aktivera denna skill vid arbete med e-handeln, varukorgskalkylering, paketpriser (bundles),
  fraktsmarta klasser (brev vs paket), varumärkesprofil, teamet och produktionsarkitekturen.
---

# Öhlunds Brygga – E-handels- & Systemexpertis

Denna skill ger AI-agenten djup domänkunskap om Öhlunds Brygga (Ljusdal, Zon 5), affärslogik, fraktklasser, rabattmotor och systemarkitektur.

---

## 1. Varumärkesprofil & Visuell Identitet

* **Företagsnamn:** Öhlunds Brygga (vid Ljusnans strand, Ljusdal, Hälsingland – Odlingszon 5).
* **Kärnverksamhet:** Handpackade kulturarvsfröer, snittblommor (dahlior, slöjsilja, zinnia, luktärt, vallmo), EU-växtpass med QR-kod till odlingsguide, samt fraktsmart logistik.
* **Logotyp:** Det officiella **Grodd-Ö:et** (`ohlunds_sprout_logo.svg`) med två distinkta blad som spirar från ringens ovansida – identiskt med trycket på de fysiska kraftpapperspåsarna.
* **Färgpalett (Tailwind-tokens):**
  - Tallgrön (`#1B2A20`): `bg-pine`, `text-pine` (primär varumärkesfärg)
  - Havre (`#F7F5EE`): `bg-oat` (primär bakgrund, papper/linnekänsla)
  - Terrakotta (`#C66B4E`): `bg-terracotta` (CTA, priser, accenter)
  - Sand (`#E8E2D5`): `bg-sand` (ramar, avdelare)
  - Bark (`#26231F`): `text-bark` (brödtext)
* **Designregel:** Inga färgglada standard-emojis i UI. Använd monokroma SVG-ikoner och ren typografi. Klippskydd för svenska tecken Å/Ä/Ö (`leading-tight`, `pt-1`).

---

## 2. Teamet bakom Öhlunds Brygga

1. **Ville Öhlund** – VD & Head of Logistics
   - Nyexaminerad ingenjör i Industriell Ekonomi. Leder logistikflöden, skalbar distribution och processtyrning.
2. **Jessica Öhlund** – Visionär & Ekoodlare
   - Tidigare IKEA-varuhuschef, grundare Öhlunds Strategi & Interim. Hjärtat i ekoodlingen vid Ljusnan, komponerar bukettrecept och provodlar sorterna i Zon 5.
3. **Magnus Öhlund** – IT-arkitekt & Byggare
   - Senior mjukvaruarkitekt. Ansvarar för molnarkitektur, Firestore-transaktioner och automation, samt bygger stugans drivhus och odlingsbäddar.
4. **Smilla Öhlund** – Art Director & Content Creator
   - Samhällsvetare med sikte på Polishögskolan. Visuellt kreativ (keramik, måleri, TikTok och video-storytelling) med servicevana från Furuvik & JYSK.

---

## 3. Paketpris, Varukorg & Kampanjlogik

### Paket vs Enskilda produkter (Sensommardröm vid Bryggan)
* **Ingående komponenter (4 fröpåsar):**
  - Slöjsilja 'Ammi Majus' (42 kr)
  - Zinnia 'Elandslängtan' (42 kr)
  - Pionvallmo 'Skärgårdspastell' (42 kr)
  - Luktärt 'Morgonbris' (42 kr)
  - *Ordinarie styckpris summa:* 168 kr.
  - *Paketpris:* **145 kr** (automatisk paketrabatt på **23 kr** per komplett set).

### Varukorgens beräkningsregel:
```typescript
const bundleDiscountMultiplier = Math.min(...quantitiesOfBundleItems);
const bundleDiscountAmount = bundleDiscountMultiplier * 23; // 23 kr rabatt per komplett paket
```
* **Dynamisk integritet:** Om kunden tar bort en av de 4 komponenterna i varukorgen eller kassan avaktiveras paketpriset omedelbart. Kvarvarande påsar debiteras ordinarie styckpris (42 kr/st).
* **Anti-Screen Theft:** Vid köp öppnas inte varukorgen i fullskärm automatiskt; en diskret toast visas med möjlighet att öppna varukorgen.
* **Persistent varukorg:** Tillståndet sparas i `localStorage` (`ohlunds_cart`).

---

## 4. Fraktsmarta Logistikregler

| Fraktklass | Pris | Leveranssätt | Fri frakt-regel |
| :--- | :--- | :--- | :--- |
| `FLAT_LETTER` | 29 kr | Direkt i brevlådan (PostNord) | **Fri frakt vid order $\ge$ 350 kr** |
| `BULKY_PARCEL` | 79 kr | Till PostNord-ombud (skrymmande) | Omfattas **EJ** av fri frakt |

* Om korgen innehåller både fröer och skrymmande varor (t.ex. krukor, redskap) tillämpas `BULKY_PARCEL` (79 kr), även om summan överstiger 350 kr. Detta ska alltid förklaras tydligt i UI.

---

## 5. Backend & Produktionsprinciper (ACID & Cloud Functions)

* **Valuta:** Alla belopp sparas uteslutande som heltal i öre/cents (`amountInCents`).
* **Lagersaldo & ACID:** Måste köras via `runTransaction` i Firestore.
* **All-or-Nothing på paket:** Reservation av bukettpaket sker atomiskt. Saknas en komponent rullas transaktionen tillbaka.
* **Reservation TTL:** Varukorgsreservationer har 30 minuters TTL.
* **Idempotens:** Bakgrundstriggers körs med `{ retry: true }` och unikt `eventId`.
* **Verifieringsloop:** Kör alltid `npx tsc --noEmit`, lint och Playwright-tester innan driftsättning.
