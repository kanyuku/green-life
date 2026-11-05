import Link from "next/link";

const workspaces = [
  {
    number: "01",
    href: "/promoter",
    title: "Field promoter",
    description: "Capture voice reports, geotag demo plots, and generate farmer coupons—even without a signal.",
    label: "Mobile field app",
    icon: "↗",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  {
    number: "02",
    href: "/stockist",
    title: "Agrovet stockist",
    description: "Redeem referrals, monitor local demand, and review AI-drafted replenishment orders.",
    label: "Inventory & sales",
    icon: "▤",
    tone: "border-amber-200 bg-amber-50 text-amber-950",
  },
  {
    number: "03",
    href: "/dashboard",
    title: "Enterprise executive",
    description: "Measure field ROI, review verification signals, and monitor ERP connectivity across regions.",
    label: "Operations intelligence",
    icon: "◫",
    tone: "border-indigo-200 bg-indigo-50 text-indigo-950",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-9 sm:px-6 sm:pt-14">
      <section className="grid gap-8 rounded-[2rem] bg-[#10271f] p-6 text-white sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:p-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-lime-400" />
            FIELD INTELLIGENCE · EAST AFRICA
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            From the demo plot to the next stocked shelf.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            One connected workflow for rural promoters, local agrovets, and enterprise teams. Keep field work moving when the network doesn’t.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-2xl font-black">Offline-first</p>
            <p className="mt-1 text-slate-300">Reports saved on device</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <p className="text-2xl font-black">3 workspaces</p>
            <p className="mt-1 text-slate-300">One demo-to-sale journey</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Choose a workspace</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">What would you like to do?</h2>
          </div>
          <span className="hidden text-sm font-medium text-slate-500 sm:block">Kenya pilot · Demo data</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.href}
              href={workspace.href}
              className="group rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-6"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl border text-xl font-black ${workspace.tone}`}>
                  {workspace.icon}
                </span>
                <span className="font-mono text-xs font-bold text-slate-400">{workspace.number}</span>
              </div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.17em] text-slate-500">{workspace.label}</p>
              <h3 className="mt-2 text-xl font-extrabold">{workspace.title}</h3>
              <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-slate-600">{workspace.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">
                Open workspace <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:p-6">
        {[
          ["01", "Capture", "Voice, photo, and attendance from the field"],
          ["02", "Attribute", "Connect farmer coupons to a verified demo"],
          ["03", "Restock", "Turn demand signals into an ERP-ready draft"],
        ].map(([step, title, description]) => (
          <div key={step} className="flex gap-3">
            <span className="font-mono text-xs font-bold text-emerald-700">{step}</span>
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
