export type ShippingClass = 'FLAT_LETTER' | 'BULKY_PARCEL';

export type ProductType = 'seed' | 'tuber' | 'accessory' | 'lifestyle' | 'bouquet_bundle';

export interface PlantSpecs {
  sowMonths: number[]; // 1-12 (t.ex. [3, 4] för mars-april)
  zones: number[]; // 1-8
  sunExposure: 'full_sun' | 'partial_shade' | 'shade';
  isCutFlower: boolean;
  heightCm?: number;
  depthCm?: number;
  spacingCm?: number;
  harvestDays?: number;
  germinationDays?: string;
  growerAdviceZone5?: string;
}

export interface ShipWindow {
  startMonth: number;
  endMonth: number;
  description: string;
}

export interface PlantPassport {
  originCountry: string; // t.ex. 'NL' (Nederländerna)
  producerCode: string;
  traceCode: string;
}

export interface Product {
  id: string;
  sku: string;
  title: string;
  subtitle?: string;
  botanicalName?: string;
  category: 'snittblommor' | 'kokstradgard' | 'bukettpaket' | 'tillbehor';
  type: ProductType;
  priceSek: number;
  regularPriceSek?: number;
  shippingClass: ShippingClass;
  shipWindow?: ShipWindow;
  specs?: PlantSpecs;
  description: string;
  inStock: boolean;
  stockQty: number;
  lotNumber?: string;
  plantPassport?: PlantPassport;
  imageUrl: string;
  backImageUrl?: string;
  matureImageUrl?: string;
  packetStyle?: 'kraft' | 'cream_botanical' | 'technical_label';
  bundleComponentIds?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'slojsilja-ammi-majus',
    sku: 'FRO-SLOJ-001',
    title: 'Slöjsilja',
    subtitle: 'Klassisk skir bukettfyllnad',
    botanicalName: 'Ammi majus',
    category: 'snittblommor',
    type: 'seed',
    priceSek: 39,
    shippingClass: 'FLAT_LETTER',
    description: 'En oumbärlig snittblomma för vilda, romantiska buketter. De spetsliknande vita flockarna ger buketten volym, lätthet och rörelse. Rikblommande och älskas av pollinerare.',
    inStock: true,
    stockQty: 240,
    lotNumber: 'LOT-2026-AM01',
    plantPassport: {
      originCountry: 'NL',
      producerCode: 'SE-X-12345',
      traceCode: 'NL-2026-9988'
    },
    imageUrl: '/assets/packets/slojsilja_kraft.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/slojsilja_bloom.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [4, 5],
      zones: [1, 2, 3, 4, 5, 6, 7, 8],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 90,
      depthCm: 0.5,
      spacingCm: 25,
      harvestDays: 75,
      germinationDays: '10-14 dagar',
      growerAdviceZone5: 'I Zon 5 / Ljusdal direktsås den bäst i maj när jorden rett sig, eller förkultiveras i pluggbrätte i april för tidigare skörd.'
    }
  },
  {
    id: 'zinnia-elandslangtan',
    sku: 'FRO-ZIN-002',
    title: "Zinnia 'Ölandslängtan'",
    subtitle: 'Aprikosa och pudriga toner',
    botanicalName: 'Zinnia elegans',
    category: 'snittblommor',
    type: 'seed',
    priceSek: 45,
    shippingClass: 'FLAT_LETTER',
    description: 'En av trädgårdens mest produktiva snittblommor med fyllda blommor i mjuka aprikos- och laxfärgade nyanser. Ju mer du skördar, desto mer blommar den.',
    inStock: true,
    stockQty: 180,
    lotNumber: 'LOT-2026-ZE02',
    plantPassport: {
      originCountry: 'NL',
      producerCode: 'SE-X-12345',
      traceCode: 'NL-2026-4412'
    },
    imageUrl: '/assets/packets/zinnia_kraft.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/zinnia_bloom.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [3, 4],
      zones: [1, 2, 3, 4, 5],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 75,
      depthCm: 0.5,
      spacingCm: 30,
      harvestDays: 70,
      germinationDays: '5-8 dagar',
      growerAdviceZone5: 'Zinnia avskyr kyla! Plantera inte ut i Hälsingland förrän nattfrostrisken är helt över (vanligen början av juni).'
    }
  },
  {
    id: 'pionvallmo-skargardspastell',
    sku: 'FRO-VAL-003',
    title: "Pionvallmo 'Skärgårdspastell'",
    subtitle: 'Fyllda pionliknande blommor och skulpturala kapslar',
    botanicalName: 'Papaver somniferum',
    category: 'snittblommor',
    type: 'seed',
    priceSek: 42,
    shippingClass: 'FLAT_LETTER',
    description: 'Ståtliga blommor med silkeslena, tätt fyllda kronblad i puderrosa och dova lila toner. Efter blomningen bildas magnifika frökapslar som är underbara att torka.',
    inStock: true,
    stockQty: 310,
    lotNumber: 'LOT-2026-PV03',
    plantPassport: {
      originCountry: 'DE',
      producerCode: 'SE-X-12345',
      traceCode: 'DE-2026-7711'
    },
    imageUrl: '/assets/packets/pionvallmo_kraft.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/pionvallmo_bloom.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [4, 5],
      zones: [1, 2, 3, 4, 5, 6, 7, 8],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 80,
      depthCm: 0.2,
      spacingCm: 20,
      harvestDays: 80,
      germinationDays: '10-15 dagar',
      growerAdviceZone5: 'Direktsås gärna tidigt på våren direkt på växtplatsen, vallmo avskyr att få sina rötter störda vid omplantering.'
    }
  },
  {
    id: 'rosenskara-pastel-pink',
    sku: 'FRO-ROS-004',
    title: "Rosenskära 'Pastel Pink'",
    subtitle: 'Romantisk blomsterprakt till frost',
    botanicalName: 'Cosmos bipinnatus',
    category: 'snittblommor',
    type: 'seed',
    priceSek: 42,
    shippingClass: 'FLAT_LETTER',
    description: 'En lättodlad favorit med fjäderlikt dillgrönt bladverk och massor av fjärilsliknande blommor i mjukt rosa toner. Tålig och tacksam.',
    inStock: true,
    stockQty: 150,
    lotNumber: 'LOT-2026-CB04',
    plantPassport: {
      originCountry: 'NL',
      producerCode: 'SE-X-12345',
      traceCode: 'NL-2026-1934'
    },
    imageUrl: '/assets/packets/rosenskara_kraft.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/rosenskara_bloom.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [3, 4, 5],
      zones: [1, 2, 3, 4, 5, 6],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 100,
      depthCm: 0.5,
      spacingCm: 30,
      harvestDays: 65,
      germinationDays: '7-12 dagar',
      growerAdviceZone5: 'Gödsla inte för mycket, då blir det bara stora gröna blad och färre blommor.'
    }
  },
  {
    id: 'luktart-morgonbris',
    sku: 'FRO-LUK-005',
    title: "Luktärt 'Morgonbris vid Bryggan'",
    subtitle: 'Gudomlig doft och långa stjälkar',
    botanicalName: 'Lathyrus odoratus',
    category: 'snittblommor',
    type: 'seed',
    priceSek: 45,
    shippingClass: 'FLAT_LETTER',
    description: 'Klassiska engelska Spencer-sorter utvalda för långa blomstjälkar och en förtrollande söt doft. Ljus lavendel och pärlemorrosa blommor.',
    inStock: true,
    stockQty: 95,
    lotNumber: 'LOT-2026-LO05',
    plantPassport: {
      originCountry: 'UK',
      producerCode: 'SE-X-12345',
      traceCode: 'UK-2026-5521'
    },
    imageUrl: '/assets/packets/luktart_kraft.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/luktart_bloom.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [2, 3, 4],
      zones: [1, 2, 3, 4, 5, 6],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 180,
      depthCm: 2.0,
      spacingCm: 15,
      harvestDays: 75,
      germinationDays: '10-20 dagar',
      growerAdviceZone5: 'Starta i mars i djupa root-trainers eller toapappersrullar. Toppa plantan vid ca 10 cm för grenade, buskiga plantor.'
    }
  },
  {
    id: 'korsbarstomat-gardeners-delight',
    sku: 'FRO-TOM-006',
    title: "Körsbärstomat 'Gardeners Delight'",
    subtitle: 'Kulturarvssort med enastående sötma',
    botanicalName: 'Solanum lycopersicum',
    category: 'kokstradgard',
    type: 'seed',
    priceSek: 38,
    shippingClass: 'FLAT_LETTER',
    description: 'Prisbelönt och pålitlig kulturarvstomat som ger rikliga klasar av söta, aromatiska röda körsbärstomater. Trivs i växthus eller varmt söderläge vid stugväggen.',
    inStock: true,
    stockQty: 210,
    lotNumber: 'LOT-2026-SL06',
    plantPassport: {
      originCountry: 'NL',
      producerCode: 'SE-X-12345',
      traceCode: 'NL-2026-8801'
    },
    imageUrl: '/assets/packets/korsbarstomat_kraft_packet.jpg',
    backImageUrl: '/assets/packets/packet_backside_qr.jpg',
    matureImageUrl: '/assets/blooms/tomat_plant.jpg',
    packetStyle: 'kraft',
    specs: {
      sowMonths: [2, 3],
      zones: [1, 2, 3, 4, 5],
      sunExposure: 'full_sun',
      isCutFlower: false,
      heightCm: 160,
      depthCm: 0.5,
      spacingCm: 45,
      harvestDays: 70,
      germinationDays: '6-10 dagar',
      growerAdviceZone5: 'I Hälsingland bör den odlas i växthus eller mot en solig skyddad timmervägg för garanterad mognad före hösten.'
    }
  },
  {
    id: 'dahlia-cafe-au-lait',
    sku: 'KNO-DAH-007',
    title: "Dahlia 'Café au Lait' (Knöl)",
    subtitle: 'Världens mest eftertraktade snittblomsdahlia',
    botanicalName: 'Dahlia pinnata',
    category: 'snittblommor',
    type: 'tuber',
    priceSek: 89,
    shippingClass: 'BULKY_PARCEL',
    shipWindow: {
      startMonth: 3,
      endMonth: 5,
      description: 'Levereras under mars–maj när frostrisken tillåter transport.'
    },
    description: 'Tallriksdahlian med de berömda gigantiska blommorna i skiftande krämigt elfenben, pudrig persika och mjuk champagne. Ett absolut måste i brudbuketter.',
    inStock: false, // Demonstrerar "Bevaka i lager"
    stockQty: 0,
    lotNumber: 'LOT-2026-DA07',
    imageUrl: '/assets/dahlia_tuber.jpg',
    matureImageUrl: '/assets/blooms/dahlia_bloom.jpg',
    specs: {
      sowMonths: [3, 4],
      zones: [1, 2, 3, 4, 5],
      sunExposure: 'full_sun',
      isCutFlower: true,
      heightCm: 110,
      depthCm: 10,
      spacingCm: 50,
      harvestDays: 90,
      growerAdviceZone5: 'Förtäck knölarna inomhus i krukor i april för att hinna få riklig blomning före de tidiga höstfrostnätterna i Hälsingland.'
    }
  },
  {
    id: 'keramikvas-bryggan',
    sku: 'TIL-VAS-008',
    title: "Handdrejad Bukettvas 'Bryggan'",
    subtitle: 'Stengods med havssandglasyr',
    category: 'tillbehor',
    type: 'lifestyle',
    priceSek: 349,
    shippingClass: 'BULKY_PARCEL',
    description: 'Unik handdrejad vas i tåligt stengods, formgiven med vid hals för att hålla fylliga snittblomsbuketter i perfekt balans på matbordet.',
    inStock: true,
    stockQty: 18,
    imageUrl: '/assets/sensommardrom_bukett_1791312135766.jpg'
  },
  {
    id: 'tramarketiketter-10p',
    sku: 'TIL-ETI-009',
    title: 'Trämärketiketter (10-pack)',
    subtitle: 'FSC-märkt trä för odlingsbädden',
    category: 'tillbehor',
    type: 'accessory',
    priceSek: 35,
    shippingClass: 'FLAT_LETTER',
    description: 'Rejäla väderbeständiga trämärketiketter som håller reda på dina sådder från förkultivering till skörd.',
    inStock: true,
    stockQty: 250,
    imageUrl: '/assets/wooden_labels.jpg'
  },
  {
    id: 'bukettpaket-sensommardrom',
    sku: 'PAK-BUK-010',
    title: "Bukettpaket: 'Sensommardröm vid Bryggan'",
    subtitle: 'Komplett snittblomsrecept av Jessica',
    category: 'bukettpaket',
    type: 'bouquet_bundle',
    priceSek: 145,
    regularPriceSek: 168,
    shippingClass: 'FLAT_LETTER',
    description: 'Ett beprövat snittblomsrecept framtaget vid Öhlunds Brygga. Innehåller Slöjsilja, Zinnia Ölandslängtan, Rosenskära Pastel Pink och Luktärt Morgonbris. Ger buketter från juli till september!',
    inStock: true,
    stockQty: 50,
    imageUrl: '/assets/sensommardrom_bukett.jpg',
    bundleComponentIds: [
      'slojsilja-ammi-majus',
      'zinnia-elandslangtan',
      'rosenskara-pastel-pink',
      'luktart-morgonbris'
    ]
  }
];
