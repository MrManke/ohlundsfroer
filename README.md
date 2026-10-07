# Öhlundsfröer 🌱

> **Från Öhlunds Brygga vid Ljusnans strand till trädgårdar i hela Sverige.**  
> Kulturhistoriska fröer, snittblommor och robusta grönsaker provodlade för Zon 5 i Hälsingland.

---

## 📖 Om Projektet

**Öhlundsfröer** är en modern, högpresterande e-handelsplattform byggd för familjen Öhlunds odlingsverksamhet och blomsterkiosk vid Ljusnans strand i Ljusdal. 

Plattformen kombinerar en varm, lantlig och skandinavisk designprofil med kompromisslös teknisk arkitektur:
* **Härdighet i fokus (Zon 5):** Sortiment och odlingsguider särskilt anpassade för tuffare klimat och kortare odlingssäsonger.
* **Fraktsmart logistik:** Automatisk differentiering mellan brevfrakt (29 kr direkt i brevlådan, fri brevfrakt över 350 kr) och paketfrakt (79 kr till PostNord-ombud vid skrymmande varor).
* **Integritet by Design (Inga cookie-banners):** 100 % fri från spårningskakor och tredjepartskakor. Varukorg sparas funktionellt i `localStorage`.
* **Mobile-First UX:** Byggd för smidig enhandshantering i växthuset (44px touch-ytor, tumvänliga snabbknappar, klippskydd för svenska tecken Å/Ä/Ö och anti-screen theft-varukorg).

---

## 📂 Projektstruktur & Dokumentation

```text
├── README.md                      # Denna projektöversikt
├── AGENTS.md                      # Globala järnregler för AI-kodagenter (max 50 rader)
│
├── docs/
│   ├── dev_guide.md               # Komplett utvecklarguide (arkitektur, moduler, affärslogik, GDPR)
│   └── design-system.md           # Varumärkesprofil, färgpalett, typsnitt & Grodd-Ö logotyp
│
├── prototype-sandbox/             # Interaktiv Next.js-prototyp för mobil & desktop
│   ├── AGENTS.md                  # Frontend-specifika mobil- & UI-regler
│   ├── public/                    # Autentiska fotografier, logotyper & illustrationer
│   └── src/app/
│       ├── page.tsx               # Huvudbutik (katalog, bukettrecept, zon 5, varukorg, footer)
│       └── om-oss/page.tsx        # "Om oss"-berättelsen om Öhlunds Brygga & familjen
│
└── assets/                        # Källfiler för logotyper, vektorgrafik & media
```

---

## 🛠️ Teknikstack

### Frontend & Butik (Aktiv Prototyp)
* **Framework:** Next.js (App Router, Turbopack)
* **Språk:** TypeScript (strikt läge)
* **Styling:** Tailwind CSS med skräddarsydd naturpalett (`tallgrön`, `havre`, `terrakotta`, `sand`, `bark`)
* **Tillstånd:** Klientlagring med `localStorage` (persistent varukorg, rabattkoder)

### Planerad Produktionsarkitektur
* **Backend:** Cloud Functions v2 (Node.js 24)
* **Databas:** Cloud Firestore (isolerade modul-samlingar med strikta Zod-kontrakt)
* **Betalning:** Stripe (alla belopp i heltal öre `amountInCents`)
* **Hosting:** Firebase App Hosting

---

## 🚀 Kom igång lokalt

Prototypen och butiksgränssnittet körs inuti `prototype-sandbox`:

```bash
# 1. Navigera till prototypen
cd prototype-sandbox

# 2. Installera beroenden
npm install

# 3. Starta utvecklingsservern
npm run dev

# 4. Bygg och kör produktionsläge
npm run build
npm start
```

Öppna därefter [http://localhost:3000](http://localhost:3000) i din webbläsare.

---

## 🌾 Design & Varumärke

Färgerna är inspirerade av Hälsinglands natur, Ljusnans vatten och odlingsjorden:
* **Tallgrön (`#1B3B2B`):** Vår primära varumärkesfärg. Symboliserar barrskog och frodig grönska.
* **Havre (`#F4EFE6`):** Varm och mjuk bakgrund som skapar en behaglig läsupplevelse utan hård vit kontrast.
* **Terrakotta (`#C25E38`):** Accentfärg för knappar, rabatter och aktiva val, hämtad från lerkrukor.
* **Sand (`#E6DEC8`) & Bark (`#3D2E24`):** Subtila gränser och djup typografisk svärta.

Fullständiga designriktlinjer finns i [docs/design-system.md](file:///c:/temp/Antigravity/Öhlundsfröer/docs/design-system.md).

---

## 📍 Hitta & Följ Oss

* **Plats:** Öhlunds Brygga, Ljusdal (Hälsingland, Odlingzon 5)
* **Instagram:** [@ohlunds_brygga](https://www.instagram.com/ohlunds_brygga/)
* **Kanaler under uppbyggnad:** TikTok & YouTube

---

*Öhlundsfröer – Handpackade kulturarvsfröer med härdighet och kärlek.*
