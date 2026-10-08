# Aktiv Uppgift: Öhlunds Brygga (Produktionsbygge)

> **Roll & Syfte:** Detta dokument är systemets aktiva arbetsminne (Single Source of Truth).
> Varje agent/session läser detta dokument först för att omedelbart förstå aktuell fas, genomförda steg och nästa uppgift.

---

## 1. Aktuell Status & Huvudmål

* **Projektfas:** Fas 1 – Monorepo Foundation & Core Setup (pnpm + Turborepo)
* **Status:** Redo för initiering av Fas 1
* **Referensdokument:** [docs/masterplan_produktion.md](file:///c:/temp/Antigravity/Öhlundsfröer/docs/masterplan_produktion.md)

---

## 2. Fas 1: Mikrouppgifter & Checklista

- [ ] **Steg 1.1: Monorepo Root Setup**
  - Skapa rot-`package.json` med pnpm-konfiguration
  - Skapa `pnpm-workspace.yaml` (`apps/*`, `packages/*`, `packages/modules/*`)
  - Skapa `turbo.json` med pipelines för `build`, `typecheck`, `lint`, `test`
  - *Verifiering:* `pnpm install` körs utan fel.

- [ ] **Steg 1.2: Delade Verktygspaket (Tooling)**
  - `packages/tsconfig/`: Delade `tsconfig.base.json`, `tsconfig.next.json`, `tsconfig.pkg.json`
  - `packages/eslint-config/`: Delad ESLint-konfiguration med `eslint-plugin-boundaries` för strikta modulgränser.

- [ ] **Steg 1.3: Kärnpaket – Catalog & Orders**
  - `packages/modules/catalog/src/types.ts`: Zod-kontrakt för produkter, växtpass (`botanicalName`, `lotCode`), badges och odlingsdata.
  - `packages/modules/orders/src/calculator.ts`: Varukorgs- och rabattmotor i ören (Sensommardröm -23 kr paketpris, brevfrakt 29 kr, fri frakt $\ge$ 350 kr, ombud 79 kr).
  - Skapa isolerade enhetstester för kalkyleringsmotorn med Vitest.

- [ ] **Steg 1.4: Delat Designsystem (packages/ui)**
  - Tokens: Tallgrön (`#1B2A20`), Havre (`#F7F5EE`), Terrakotta (`#C66B4E`), Sand (`#E8E2D5`), Bark (`#26231F`).
  - SVG-komponent för Grodd-Ö logotypen (`ohlunds_sprout_logo`).
  - Grundknappar och toast-komponenter.

- [ ] **Steg 1.5: Tyst Verifiering av Fas 1**
  - `pnpm turbo typecheck --silent`
  - `pnpm turbo lint --silent`
  - `pnpm turbo test --silent`
  - Kontrollera att alla acceptanskriterier är uppfyllda innan Fas 2 påbörjas.

---

## 3. Berörda Filvägar

* `package.json` (rot)
* `pnpm-workspace.yaml`
* `turbo.json`
* `packages/tsconfig/**`
* `packages/eslint-config/**`
* `packages/modules/catalog/**`
* `packages/modules/orders/**`
* `packages/ui/**`

---

## 4. Kända Blockers / Beroenden

* Inga aktiva blockers.
* `pnpm` (v12.10.1) och `turbo` (v2.11.7) är verifierade och installerade i miljön.
* `prototype-sandbox/` lämnas helt intakt som referens.
