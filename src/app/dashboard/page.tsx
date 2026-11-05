const kpis = [
  { label: "Total demos conducted", value: "1,284", change: "+12.8%", note: "vs. prior 30 days", color: "text-emerald-300" },
  { label: "Word-of-mouth conversion", value: "18.6%", change: "+2.4 pts", note: "farmer coupon attribution", color: "text-cyan-300" },
  { label: "Revenue per promoter dollar", value: "KSh 8.40", change: "+0.80", note: "verified attributed sales", color: "text-amber-300" },
  { label: "Verified GPS logs", value: "96.2%", change: "1,236 / 1,284", note: "cryptographic + location checks", color: "text-violet-300" },
];

const fieldLogs = [
  { promoter: "Asha N.", location: "Kisumu East", time: "Today · 10:42", confidence: 98, status: "Verified" },
  { promoter: "Joseph K.", location: "Nakuru South", time: "Today · 09:18", confidence: 94, status: "Verified" },
  { promoter: "Miriam T.", location: "Mombasa North", time: "Today · 08:51", confidence: 61, status: "Review" },
  { promoter: "Peter O.", location: "Eldoret Central", time: "Yesterday · 16:20", confidence: 37, status: "Failed" },
];

const regions = [
  { name: "Kisumu East", product: "Maize Guard", demand: 92, weeks: "2 weeks", risk: "Stockout risk" },
  { name: "Nakuru South", product: "NPK Grow Blend", demand: 78, weeks: "3 weeks", risk: "Reorder soon" },
  { name: "Mombasa North", product: "Seed Booster", demand: 54, weeks: "4 weeks", risk: "Monitor" },
  { name: "Eldoret Central", product: "Maize Guard", demand: 31, weeks: "3 weeks", risk: "Healthy" },
];

const heatmap = [
  [1, 2, 1, 0, 3, 2, 1, 0],
  [0, 1, 3, 3, 2, 1, 0, 0],
  [0, 0, 2, 3, 3, 2, 1, 0],
  [1, 2, 3, 2, 1, 0, 1, 2],
  [2, 3, 2, 1, 0, 1, 2, 3],
];

function heatColor(intensity: number): string {
  return ["bg-slate-800", "bg-emerald-950", "bg-emerald-700", "bg-lime-400"][intensity];
}

export default function ExecutiveDashboard() {
  return (
    <main className="min-h-screen bg-[#090f17] px-4 pb-28 pt-6 text-slate-100 sm:px-6 sm:pb-12">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Enterprise operations · Kenya
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Field intelligence</h1>
            <p className="mt-1 text-sm text-slate-400">Demo attribution, field verification, and demand risk overview</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200">Last 30 days⌄</button>
            <button type="button" className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-extrabold text-slate-950">Export report</button>
          </div>
        </header>

        <section aria-label="Key performance indicators" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((item) => (
            <article key={item.label} className="rounded-2xl border border-slate-800 bg-[#101923] p-4 sm:p-5">
              <p className="text-xs font-semibold text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-black tracking-tight">{item.value}</p>
              <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
                <span className={`font-extrabold ${item.color}`}>{item.change}</span>
                <span className="text-right text-slate-500">{item.note}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
          <article className="rounded-2xl border border-slate-800 bg-[#101923] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-300">Field integrity</p>
                <h2 className="mt-1 text-lg font-extrabold">Recent field logs</h2>
              </div>
              <span className="rounded-full border border-emerald-900 bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-300">AI verification active</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-xs">
                <thead className="border-b border-slate-800 text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="pb-3 pr-3 font-bold">Promoter</th>
                    <th className="pb-3 pr-3 font-bold">Location · time</th>
                    <th className="pb-3 pr-3 font-bold">Voice confidence</th>
                    <th className="pb-3 font-bold">Cryptographic status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {fieldLogs.map((log) => (
                    <tr key={log.promoter} className={log.status === "Failed" ? "bg-rose-950/25" : log.status === "Review" ? "bg-amber-950/20" : ""}>
                      <td className="py-3 pr-3 font-bold text-slate-100">{log.promoter}</td>
                      <td className="py-3 pr-3"><span className="block text-slate-200">{log.location}</span><span className="mt-0.5 block text-[10px] text-slate-500">{log.time}</span></td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-8 font-mono font-bold ${log.confidence < 70 ? "text-rose-300" : "text-slate-200"}`}>{log.confidence}%</span>
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-700"><i className={`block h-full rounded-full ${log.confidence < 70 ? "bg-rose-400" : "bg-emerald-400"}`} style={{ width: `${log.confidence}%` }} /></span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide ${
                          log.status === "Verified" ? "bg-emerald-950 text-emerald-300" : log.status === "Review" ? "bg-amber-950 text-amber-300" : "bg-rose-950 text-rose-300"
                        }`}>{log.status === "Failed" ? "Failed · investigate" : log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[10px] text-slate-500">Sample verification records · confidence scores and cryptographic status are illustrative.</p>
          </article>

          <aside className="rounded-2xl border border-slate-800 bg-[#101923] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-300">Integration health</p>
                <h2 className="mt-1 text-lg font-extrabold">ERP connector</h2>
              </div>
              <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-emerald-300">Healthy</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["SAP S/4HANA", "Connected", "text-emerald-300"],
                ["Webhook latency", "45 ms", "text-slate-100"],
                ["Events delivered", "2,409 today", "text-slate-100"],
                ["Retry queue", "3 awaiting retry", "text-amber-300"],
                ["Data residency", "Kenya · private tenant", "text-slate-100"],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2.5 text-xs last:border-0">
                  <span className="text-slate-400">{label}</span><span className={`text-right font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-[10px] leading-5 text-slate-400">
              Adapter values are sample data. No live ERP connection is configured.
            </div>
          </aside>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="rounded-2xl border border-slate-800 bg-[#101923] p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-amber-300">2–4 weeks post application</p>
                <h2 className="mt-1 text-lg font-extrabold">Demand shock heatmap</h2>
              </div>
              <span className="text-[10px] text-slate-500">Demo activity → demand</span>
            </div>
            <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
              <div className="flex flex-col justify-between pb-1 text-[8px] font-semibold text-slate-500">
                <span>W4</span><span>W3</span><span>W2</span><span>W1</span><span>Now</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {heatmap.flatMap((row, rowIndex) => row.map((intensity, columnIndex) => (
                  <span key={`${rowIndex}-${columnIndex}`} className={`aspect-square rounded-sm ${heatColor(intensity)}`} title={`Week ${rowIndex + 1}, area ${columnIndex + 1}: intensity ${intensity}`} />
                )))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[8px] text-slate-500">
              <span>Lower</span>{[0, 1, 2, 3].map((intensity) => <i key={intensity} className={`h-2.5 w-2.5 rounded-sm ${heatColor(intensity)}`} />)}<span>Higher</span>
            </div>
            <div className="mt-4 rounded-xl border border-rose-900/70 bg-rose-950/30 p-3 text-xs">
              <p className="font-extrabold text-rose-300">Potential stockout · Kisumu East</p>
              <p className="mt-1 leading-5 text-slate-300">Maize Guard inventory may fall below safety stock in ~14 days.</p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-[#101923] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-violet-300">Regional forecast</p>
                <h2 className="mt-1 text-lg font-extrabold">Upcoming inventory pressure</h2>
              </div>
              <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[9px] font-bold text-slate-300">4 regions tracked</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[540px] text-left text-xs">
                <thead className="border-b border-slate-800 text-[9px] uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="pb-3 pr-3">Region</th><th className="pb-3 pr-3">Product</th><th className="pb-3 pr-3">Demand index</th><th className="pb-3 pr-3">Window</th><th className="pb-3">Signal</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {regions.map((region) => (
                    <tr key={region.name}>
                      <td className="py-3 pr-3 font-bold">{region.name}</td>
                      <td className="py-3 pr-3 text-slate-300">{region.product}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2"><span className="w-6 font-mono">{region.demand}</span><span className="h-1.5 w-12 rounded-full bg-slate-800"><i className={`block h-full rounded-full ${region.demand > 75 ? "bg-rose-400" : region.demand > 50 ? "bg-amber-300" : "bg-emerald-400"}`} style={{ width: `${region.demand}%` }} /></span></div>
                      </td>
                      <td className="py-3 pr-3 text-slate-400">{region.weeks}</td>
                      <td className={`py-3 text-[10px] font-bold ${region.demand > 75 ? "text-rose-300" : region.demand > 50 ? "text-amber-300" : "text-emerald-300"}`}>{region.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <footer className="mt-4 flex flex-col gap-2 border-t border-slate-800 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>FieldDemo Pulse · Executive intelligence · sample data</span>
          <span>Self-hosted deployment · enterprise data sovereignty</span>
        </footer>
      </div>
    </main>
  );
}
