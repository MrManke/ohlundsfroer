import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om oss – Öhlundsfröer & Öhlunds Brygga",
  description: "Möt familjen bakom Öhlundsfröer vid Ljusnans strand i Ljusdal. Ville Öhlund (VD & Logistik), Jessica Öhlund (Visionär & Ekoodlare) och Magnus Öhlund (IT-arkitekt & Byggare).",
};

export default function OmOssPage() {
  const teamMembers = [
    {
      name: "Ville Öhlund",
      role: "VD & Head of Logistics",
      titleNote: "Ingenjör i Industriell Ekonomi",
      image: "/assets/team/ville_ohlund.jpg",
      quote: "Att få bygga ett modernt e-handelsbolag från grunden – där varje logistikflöde är optimerat och fraktsmart – är min stora drivkraft och dröm.",
      bio: [
        "Ville är nyexaminerad ingenjör inom Industriell Ekonomi och leder bolagets övergripande strategi och operativa distributionsflöde. Med ett skarpt öga för processtyrning och lageroptimering ser han till att distributionskedjan – från EU-import och ompackning till sista milen ut till kundens brevlåda – är så snabb, kostnadseffektiv och hållbar som möjligt.",
        "Hans entreprenörsdröm om att bygga ett bolag från grunden kombineras här med modern industriell logik: fraktsmarta brevformat, digital spårbarhet och skalbara distributionsprocesser som gör att fröerna når trädgårdsodlare i hela Sverige på rekordtid.",
      ],
      skills: ["Logistikoptimering", "Distributionskedjor", "Entreprenörskap", "Affärsutveckling"],
    },
    {
      name: "Jessica Öhlund",
      role: "Visionär & Ekoodlare",
      titleNote: "Tidigare IKEA-varuhuschef • Grundare Öhlunds Strategi & Interim",
      image: "/assets/team/jessica_ohlund.jpg",
      originalGardenPhoto: "/assets/team/jessica_original_garden.jpg",
      quote: "Det finns en magi i att så ett litet frö och se det blomma ut i en explosion av dahlior och snittblommor vid Ljusnans strand. Den glädjen vill jag ge till fler.",
      bio: [
        "Jessica är hjärtat och den kreativa motorn i Öhlundsfröer. Med en lång och gedigen bakgrund som ledare inom IKEA – där hon bland annat verkat som varuhuschef och i flera nationella och internationella chefsroller – besitter hon ett unikt driv och djup förståelse för kundupplevelse och sortiment.",
        "Idag driver hon Öhlunds Strategi och Interim, men hennes största passion brinner vid odlingsbäddarna på Öhlunds Brygga. Som certifierad visionär och hängiven ekoodlare provodlar hon ett hav av dahlior, vallmo och snittblommor. Hon komponerar våra unika bukettrecept och ser till att alla sorter klarar det nordiska klimatet och är 100 % giftfria.",
      ],
      skills: ["Ekologisk odling", "Dahlia-specialist", "Strategiskt ledarskap", "Bukettkomposition"],
    },
    {
      name: "Magnus Öhlund",
      role: "IT-arkitekt & Byggare",
      titleNote: "Senior Mjukvaruarkitekt • System- & Byggansvarig",
      image: "/assets/team/magnus_ohlund.jpg",
      quote: "Att designa robust mjukvaruarkitektur i molnet och att bygga drivhus och upphöjda blombäddar i furu längs älven kräver samma sak: precision, tålamod och hållbarhet över tid.",
      bio: [
        "Magnus är den erfarne IT-arkitekten som ser till att den digitala motorn i Öhlundsfröer snurrar felfritt dygnet runt. Med mångårig erfarenhet av komplexa distribuerade system, molnarkitektur och realtidsplattformar har han byggt systemet som hanterar allt från lagersaldo och transaktioner till automatiska odlingsguider via QR-koder.",
        "Men när tangentbordet vilar tar Magnus på sig snickarbältet. Det är han som ritar och bygger stugans drivhus, upphöjda odlingsbäddar, bevattningslösningar och den charmiga blomsterkiosken vid Öhlunds Brygga. En perfekt symbios mellan high-tech och traditionellt hantverk.",
      ],
      skills: ["Molnarkitektur & IT", "E-handelssystem", "Drivhuskonstruktion", "Automation & Drift"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-oat text-bark">
      {/* Top Banner */}
      <div className="bg-pine text-oat text-xs py-2 px-4 text-center tracking-wide font-sans border-b border-pine-light">
        <span>
          🌾 <strong>Öhlunds Brygga vid Ljusnan (Ljusdal, Zon 5):</strong> Från vår hobbyodling och blomsterkiosk till din trädgård • Följ oss på Instagram @ohlunds_brygga
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-oat/95 backdrop-blur-md border-b border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border-2 border-pine flex items-center justify-center bg-sand-light transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="14" r="7" stroke="#1B2A20" strokeWidth="2.2" />
                <path d="M12 7V13" stroke="#1B2A20" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M12 8C12 5 15 4 16 5C17 6 15 9 12 8Z" fill="#1B2A20" />
                <path d="M12 9C12 6 9 5 8 6C7 7 9 10 12 9Z" fill="#1B2A20" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-pine block leading-none">
                ÖHLUNDS FRÖER
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-terracotta mt-0.5 block">
                Öhlunds Brygga • Ljusdal
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-6 font-sans text-sm font-medium">
            <Link href="/" className="text-bark hover:text-terracotta transition-colors">
              ← Tillbaka till Fröbutiken
            </Link>
            <a
              href="https://www.instagram.com/ohlunds_brygga/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sand hover:bg-pine hover:text-white text-pine px-4 py-2 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>@ohlunds_brygga</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-pine text-oat overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/ohlunds_brygga_hero_1791312124759.jpg"
            alt="Öhlunds Brygga bakgrund"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-sand/20 text-sand text-xs font-mono uppercase tracking-widest mb-4">
            Familjeföretaget vid Ljusnans strand • Ljusdal, Hälsingland
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight mb-6">
            Möt oss på Öhlunds Brygga
          </h1>
          <p className="text-oat/90 font-sans text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Här möts industriell logistikexpertis, mångårigt strategiskt ledarskap och avancerad systemarkitektur – förenat med ett djupt och gemensamt hjärta för ekologisk odling och svensk natur.
          </p>
        </div>
      </section>

      {/* Platsen & Historien: Från Blomsterkiosk till E-handel */}
      <section className="py-16 sm:py-20 bg-sand-light border-b border-sand">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-terracotta mb-2 block">
                Vår historia & plats
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-pine mb-6 leading-snug">
                Från ”Swish & Grab”-kiosken till hela Sveriges trädgårdar
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-bark/80 leading-relaxed font-sans">
                <p>
                  Allt började vid stugan på Ljusnans östra strand i vackra Ljusdal. Där Jessica anlade blomsterodlingar och dahliafält, och Magnus snickrade den lilla lokala blomsterkiosken med <em>Swish & Grab</em> som snabbt blev ett uppskattat stopp för grannar och förbipasserande.
                </p>
                <p>
                  Med Villes brinnande ambition att bygga ett bolag och hans ingenjörskunskaper inom industriell logistik väcktes idén: Varför inte ta samma passion, omsorg och beprövade kvalitet ut till hela Sverige?
                </p>
                <p>
                  Vi importerar de finaste kulturarvsfröerna från EU:s ledande certifierade odlare. Vi provodlar dem under tuffa förhållanden i <strong>Odlingszon 5</strong>, och packar varje påse för hand här vid Bryggan – med växtpass, lotnummer och mobilguide till varje odlare.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-pine">
                <div className="bg-oat px-3.5 py-2 rounded-xl border border-sand">
                  📍 Ljusdal (Zon 5)
                </div>
                <div className="bg-oat px-3.5 py-2 rounded-xl border border-sand">
                  🌸 Dahlior & Snittblommor
                </div>
                <div className="bg-oat px-3.5 py-2 rounded-xl border border-sand">
                  📦 Fraktsmart logistik
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <Image
                  src="/assets/team/jessica_original_garden.jpg"
                  alt="Jessica vid dahliaodlingen vid Ljusnan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-sand max-w-xs">
                <span className="text-[11px] uppercase font-bold text-terracotta block tracking-wider mb-1">
                  📸 Från Instagram @ohlunds_brygga
                </span>
                <p className="text-xs text-bark/80 italic">
                  ”Här visar jag min hobbyodling och de blommor & grönsaker som finns i vår blomsterkiosk.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Profiles Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-terracotta mb-2 block">
            De som driver bolaget
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-pine mb-4">
            Teamet bakom Öhlundsfröer
          </h2>
          <p className="text-bark/70 text-base font-sans">
            Tre kompletterande perspektiv som tillsammans skapar Sveriges mest genomtänkta och fraktsmarta trädgårdsupplevelse.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-3xl border border-sand overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Portrait Image */}
              <div className="relative aspect-square w-full bg-sand-light overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-pine/80 backdrop-blur-md text-oat text-[11px] font-sans font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-pine">
                    {member.name}
                  </h3>
                  <span className="text-xs font-sans text-terracotta font-semibold block mt-1">
                    {member.titleNote}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="border-l-2 border-terracotta pl-3.5 my-3 text-xs italic text-bark/80 leading-relaxed bg-oat/50 p-2.5 rounded-r-xl">
                  ”{member.quote}”
                </blockquote>

                {/* Bio Paragraphs */}
                <div className="space-y-3 text-xs sm:text-sm text-bark/75 leading-relaxed font-sans mb-6">
                  {member.bio.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* Skill Pills */}
                <div className="mt-auto pt-4 border-t border-sand flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-sand-light text-bark/80 text-[11px] px-2.5 py-1 rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filosofi & Odlingslöfte */}
      <section className="bg-pine text-oat py-20 border-t border-pine-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-sand mb-3 block">
            Vårt gemensamma löfte
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-8">
            Härdat för Zon 5 – Skapat för att lyckas överallt
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-10">
            <div className="bg-pine-light/60 p-6 rounded-2xl border border-sand/10">
              <span className="text-2xl mb-3 block">❄️</span>
              <h4 className="font-serif text-lg text-white mb-2">Testat i Ljusdal (Zon 5)</h4>
              <p className="text-xs text-oat/80 leading-relaxed font-sans">
                Klarar våra växter de sena frostnätterna i Hälsingland och den korta norrländska odlingssäsongen så kommer de att stormtrivas i din trädgård, oavsett var i landet du bor.
              </p>
            </div>

            <div className="bg-pine-light/60 p-6 rounded-2xl border border-sand/10">
              <span className="text-2xl mb-3 block">🌱</span>
              <h4 className="font-serif text-lg text-white mb-2">EU-växtpass & Full Spårbarhet</h4>
              <p className="text-xs text-oat/80 leading-relaxed font-sans">
                Varje fröpåse och bulksändning spåras mekaniskt med unika lotnummer. Inga anonyma blandningar – bara certifierade, kontrollerade fröer av högsta kvalitet.
              </p>
            </div>

            <div className="bg-pine-light/60 p-6 rounded-2xl border border-sand/10">
              <span className="text-2xl mb-3 block">📬</span>
              <h4 className="font-serif text-lg text-white mb-2">Fraktsmart Direkt till Lådan</h4>
              <p className="text-xs text-oat/80 leading-relaxed font-sans">
                Villes logistikarkitektur säkerställer att fröerna skickas i platta brev (29 kr porto, fri frakt över 350 kr). Inga onödiga turer till ombudet för vanliga fröpåsar.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="bg-terracotta hover:bg-clay text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl inline-block"
            >
              Utforska fröerna & bukettrecepten i butiken →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bark text-sand py-12 border-t border-sand/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-4 font-sans">
          <p className="text-sand/80">
            © 2026 Öhlundsfröer / Öhlunds Brygga. All rights reserved. Ljusdal, Hälsingland.
          </p>
          <div className="flex justify-center gap-6 text-sand/60">
            <Link href="/" className="hover:text-sand">
              Butik
            </Link>
            <Link href="/om-oss" className="hover:text-sand">
              Om oss
            </Link>
            <a
              href="https://www.instagram.com/ohlunds_brygga/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand"
            >
              Instagram @ohlunds_brygga
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
