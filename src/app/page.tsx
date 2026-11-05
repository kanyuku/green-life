import Link from "next/link";

const capabilityCards = [
  {
    title: "Voice & field capture",
    description:
      "Offline-first mobile reporting converts Swahili and English voice notes into structured JSON field telemetry.",
    accent: "from-emerald-500 to-green-600",
  },
  {
    title: "Agentic demand dispatcher",
    description:
      "AI monitors live demo traction and issues ERP-approved purchase orders before stockouts hit nearby agrovets.",
    accent: "from-lime-500 to-emerald-600",
  },
  {
    title: "Attribution & ledger",
    description:
      "Cryptographic referral tokens create verifiable chain-of-custody between a demo, farmer purchase, and promoter reward.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    title: "ERP connector layer",
    description:
      "Standardized webhooks bridge SAP, Dynamics, Oracle, or bespoke enterprise backends with rural field events.",
    accent: "from-teal-500 to-cyan-600",
  },
];

const phasePlan = [
  {
    phase: "Phase 1",
    title: "Core API adapter & data schema",
    text: "Event-driven plugin, PostgreSQL/Redis architecture, ERP webhook drivers, and telemetry schemas.",
  },
  {
    phase: "Phase 2",
    title: "Offline PWA & voice AI engine",
    text: "IndexedDB capture, Web Audio, low-bandwidth sync, and multilingual transcription pipeline.",
  },
  {
    phase: "Phase 3",
    title: "Agentic demand & smart contracts",
    text: "Referral tokens, localized demand modeling, and automated restocking alerts with vendor approval flows.",
  },
  {
    phase: "Phase 4",
    title: "Field pilot & enterprise hardening",
    text: "Real-world validation, Docker/Kubernetes packaging, security hardening, and open-source documentation.",
  },
];

const kpis = [
  { label: "Active promoters", value: "146" },
  { label: "Demos this week", value: "28" },
  { label: "Estimated farmers reached", value: "3.4K" },
  { label: "Forecasted restock value", value: "$445K" },
];

const flowSteps = [
  "Capture a 30-second voice update and geotagged plot photo offline.",
  "Sync using low-bandwidth connectivity and verify GPS and transcript integrity.",
  "Issue digital coupons and tie farmer actions to the original promoter ID.",
  "Trigger ERP reorder workflows when demand spikes and stock levels dip.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(127,255,182,0.18),_transparent_42%),linear-gradient(180deg,#f4fbf6_0%,#edf7ef_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-emerald-200/80 bg-white/75 px-5 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-500 text-lg font-bold text-white shadow-md shadow-emerald-200">
              F
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">GreenLife</p>
              <h1 className="text-sm font-semibold text-slate-800">FieldDemo Pulse</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#capabilities" className="transition hover:text-emerald-700">Capabilities</a>
            <a href="#workflow" className="transition hover:text-emerald-700">Workflow</a>
            <a href="#roadmap" className="transition hover:text-emerald-700">Roadmap</a>
            <Link href="/dashboard" className="rounded-full border border-emerald-700 px-4 py-2 text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
              Pilot dashboard
            </Link>
          </nav>
        </header>

        <section className="grid items-center gap-10 pb-18 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:pt-20">
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Agentic & on-chain field-force intelligence
            </span>
            <h2 className="mt-6 max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Turning rural demo plots into measurable sales momentum.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              FieldDemo Pulse closes the data gap between village-level promoter activity and corporate ERP decisions, so agribusinesses can track demos, convert interest into sales, and restock before demand spikes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
              >
                View pilot dashboard
              </Link>
              <a
                href="#capabilities"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                Explore architecture
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-emerald-200/80 bg-white/80 p-5 shadow-[0_30px_80px_rgba(6,95,70,0.12)] backdrop-blur-sm">
              <div className="rounded-[24px] bg-gradient-to-br from-emerald-50 via-lime-50 to-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Live field system</p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">Demo-to-sale intelligence</h3>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Online</span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-900 p-4 text-white">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-emerald-200">
                      <span>Voice capture</span>
                      <span>Synced</span>
                    </div>
                    <p className="mt-3 text-lg font-semibold">“Mkulima mwenzetu ... demand for maize treatment is rising.”</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Inventory signal</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">+34%</p>
                      <p className="mt-1 text-sm text-slate-600">Projected demand surge</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Referral trace</p>
                      <p className="mt-2 text-2xl font-black text-slate-900">12</p>
                      <p className="mt-1 text-sm text-slate-600">Converted farmers</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>Agrovet restock readiness</span>
                      <span>92%</span>
                    </div>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                      <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-500 to-lime-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="pt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">System architecture</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Four integrated engine layers for modern field operations.</h3>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map((card) => (
              <article key={card.title} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className={`mb-4 h-12 w-12 rounded-2xl bg-gradient-to-br ${card.accent}`} />
                <h4 className="text-xl font-bold text-slate-900">{card.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="pt-20">
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Operational flow</p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">From village demo to executive ERP insight.</h3>
            </div>
            <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 md:block">
              Data lifecycle in 4 steps
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {flowSteps.map((step, index) => (
              <div key={step} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">
                  0{index + 1}
                </div>
                <p className="text-base leading-7 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="roadmap" className="pt-20 pb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Engineering roadmap</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">A 16-week path to enterprise-ready MVP delivery.</h3>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {phasePlan.map((phase) => (
              <div key={phase.phase} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{phase.phase}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <h4 className="mt-4 text-xl font-bold text-slate-900">{phase.title}</h4>
                <p className="mt-3 text-base leading-7 text-slate-600">{phase.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
