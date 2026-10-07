# Öhlundsfröer – Prototyp Sandbox (Next.js)

Detta är den interaktiva frontend-prototypen för **Öhlundsfröer** (`prototype-sandbox`).

## Innehåll
* **Huvudbutik (`src/app/page.tsx`):**
  - Responsiv header med Grodd-Ö-logotyp, varukorgsindikator och horisontella snabbknappar.
  - Dynamiskt frö- och tillbehörssortiment med odlingszoner, direktsådd och SKU-information.
  - Sensommardröm bukettrecept & bukettpaket.
  - Odla i Zon 5 härdighetsguide.
  - Slide-out varukorg med:
    - Fri frakt-mätare (förtydligad för brevorder vs skrymmande paket).
    - Kampanjkodsmotor (procent, fast avdrag, fri frakt).
    - Anti-screen theft (toast-avisering vid köp istället för auto-öppning).
    - Persistent lagring i `localStorage`.
  - Omfattande sidfot med sociala medier (Instagram `@ohlunds_brygga`, TikTok, YouTube) och GDPR-information.
* **Om oss-sida (`src/app/om-oss/page.tsx`):**
  - Autentiskt bildgalleri och berättelsen om familjen Öhlund (Jessica, Magnus, Ville) vid Ljusnans strand.

## Utveckling & Körning

```bash
# Starta dev-server (Turbopack)
npm run dev

# Bygg och kör produktionsläge
npm run build
npm start
```

Se [AGENTS.md](./AGENTS.md) för frontend-regler och [../docs/dev_guide.md](../docs/dev_guide.md) för fullständig systemdokumentation.
