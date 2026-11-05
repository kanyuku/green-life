"use client";

import { useState } from "react";

type StockItem = {
  product: string;
  sku: string;
  onHand: number;
  projected: number;
  unit: string;
};

const initialStock: StockItem[] = [
  { product: "GreenLife Maize Guard", sku: "GL-MG-20", onHand: 38, projected: 92, unit: "cases" },
  { product: "CropStart Seed Booster", sku: "GL-SB-05", onHand: 76, projected: 118, unit: "units" },
  { product: "NPK Grow Blend", sku: "GL-NPK-50", onHand: 21, projected: 63, unit: "bags" },
];

const draftLines = [
  { product: "GreenLife Maize Guard", sku: "GL-MG-20", current: 38, order: 70, unit: "cases", eta: "5 days" },
  { product: "NPK Grow Blend", sku: "GL-NPK-50", current: 21, order: 50, unit: "bags", eta: "7 days" },
];

type StoredCoupon = {
  code: string;
  promoterId: string;
  used: boolean;
};

export default function StockistPage() {
  const [coupon, setCoupon] = useState("");
  const [redeemed, setRedeemed] = useState(false);
  const [verifiedPromoterId, setVerifiedPromoterId] = useState("");
  const [redemptionError, setRedemptionError] = useState("");
  const stock = initialStock;
  const [orderApproved, setOrderApproved] = useState(false);
  const [notice, setNotice] = useState("");

  function redeemCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRedeemed(false);
    setRedemptionError("");
    setNotice("");
    const submittedCode = coupon.trim().toUpperCase();
    if (submittedCode === "PULSE-MAIZE") {
      setVerifiedPromoterId("0x9f4b77a2c83d104e1a58d903");
      setRedeemed(true);
      setCoupon("");
      return;
    }

    let storedCoupon: StoredCoupon | null = null;
    try {
      const saved = localStorage.getItem("field-demo-coupon");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "code" in parsed &&
          "promoterId" in parsed &&
          "used" in parsed &&
          typeof parsed.code === "string" &&
          typeof parsed.promoterId === "string" &&
          typeof parsed.used === "boolean"
        ) {
          storedCoupon = {
            code: parsed.code,
            promoterId: parsed.promoterId,
            used: parsed.used,
          };
        }
      }
    } catch (caught) {
      setRedemptionError(caught instanceof Error ? `Could not read the local coupon registry: ${caught.message}` : "Could not read the local coupon registry.");
      return;
    }

    if (!storedCoupon || storedCoupon.code !== submittedCode) {
      setRedemptionError("Coupon not found. Check the code or generate one in the Promoter workspace.");
      return;
    }
    if (storedCoupon.used) {
      setRedemptionError("This coupon has already been redeemed.");
      return;
    }
    try {
      localStorage.setItem("field-demo-coupon", JSON.stringify({ ...storedCoupon, used: true }));
    } catch (caught) {
      setRedemptionError(caught instanceof Error ? `Could not mark the coupon redeemed: ${caught.message}` : "Could not mark the coupon redeemed.");
      return;
    }
    setVerifiedPromoterId(storedCoupon.promoterId);
    setRedeemed(true);
    setCoupon("");
  }

  function approveOrder() {
    setOrderApproved(true);
    setNotice("Draft PO-KE-2048 approved and added to the simulated ERP outbox.");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Agrovet stockist portal</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Mwangaza Agrovet</h1>
          <p className="mt-1 text-sm text-slate-600">Kisumu East · Demo inventory and orders</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">3 inventory lines</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-900">ERP adapter ready</span>
        </div>
      </header>

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-900">✓</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-emerald-800">Coupon clearance</p>
              <h2 className="mt-1 text-xl font-extrabold">Redeem farmer offer</h2>
            </div>
          </div>
          <form onSubmit={redeemCoupon} className="mt-5">
            <label htmlFor="coupon-code" className="text-sm font-bold">SMS coupon code</label>
            <div className="mt-2 flex gap-2">
              <input
                id="coupon-code"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="e.g. PULSE-MAIZE"
                autoCapitalize="characters"
                className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 font-mono text-sm uppercase outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
              <button type="submit" className="min-h-12 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800">Validate</button>
            </div>
            {redemptionError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900">{redemptionError}</p>}
            {redeemed && (
              <div role="status" className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-extrabold text-emerald-950">Coupon validated · 10% demo discount</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-emerald-900">Promoter ID verified · demo ledger</p>
                <p className="mt-1 break-all font-mono text-xs text-emerald-900">{verifiedPromoterId}</p>
              </div>
            )}
            <p className="mt-3 text-xs leading-5 text-slate-500">Try <span className="font-mono font-bold">PULSE-MAIZE</span> or generate a coupon in the Promoter workspace. Registry is local demo data.</p>
          </form>
        </div>

        <div className="rounded-[1.7rem] border border-amber-200 bg-[#fffaf0] p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-amber-900">Demand watch</p>
              <h2 className="mt-1 text-xl font-extrabold">Local demo signals</h2>
            </div>
            <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-extrabold text-amber-950">2 alerts</span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-amber-200 bg-white p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-800">High · in 2 weeks</span>
              <h3 className="mt-2 text-sm font-extrabold">Maize Guard demand spike</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">3 recent village demos near Kisumu East; forecast demand is 2.4× baseline.</p>
            </article>
            <article className="rounded-2xl border border-amber-200 bg-white p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-900">Watch · in 3 weeks</span>
              <h3 className="mt-2 text-sm font-extrabold">NPK Grow Blend trending up</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">Two demo plots scheduled. Current stock cover is about 5 days.</p>
            </article>
          </div>
        </div>
      </section>

      {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{notice}</p>}

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-500">Inventory tracker</p>
              <h2 className="mt-1 text-xl font-extrabold">Now vs. demo projection</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">Next 14 days</span>
          </div>
          <div className="mt-5 space-y-5">
            {stock.map((item) => {
              const max = Math.max(item.projected, 1);
              return (
                <div key={item.sku}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.product}</p>
                      <p className="font-mono text-[10px] text-slate-500">{item.sku}</p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-slate-600">{item.onHand} {item.unit} now</p>
                  </div>
                  <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100">
                    <span className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, item.onHand / max * 100)}%` }} />
                    <span className="h-full bg-amber-300/80" style={{ width: `${Math.max(0, Math.min(100, (item.projected - item.onHand) / max * 100))}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-500">
                    <span>Current stock</span><span>Projected demand {item.projected}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-600" /> On hand</span>
            <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-sm bg-amber-300" /> Projected additional demand</span>
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-indigo-800">Agentic dispatcher · draft</p>
              <h2 className="mt-1 text-xl font-extrabold">Suggested replenishment</h2>
              <p className="mt-1 text-sm text-slate-600">PO-KE-2048 · Mwangaza Agrovet · Delivery to Kisumu</p>
            </div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${orderApproved ? "bg-emerald-100 text-emerald-900" : "bg-indigo-100 text-indigo-900"}`}>
              {orderApproved ? "Sent to ERP outbox" : "Needs your approval"}
            </span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200 text-[10px] uppercase tracking-[0.12em] text-slate-500">
                <tr><th className="pb-3 pr-3 font-bold">Product</th><th className="pb-3 pr-3 font-bold">On hand</th><th className="pb-3 pr-3 font-bold">Suggested order</th><th className="pb-3 font-bold">Lead time</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draftLines.map((line) => (
                  <tr key={line.sku}>
                    <td className="py-3 pr-3"><p className="font-bold">{line.product}</p><p className="font-mono text-[10px] text-slate-500">{line.sku}</p></td>
                    <td className="py-3 pr-3 text-slate-600">{line.current} {line.unit}</td>
                    <td className="py-3 pr-3 font-extrabold text-emerald-900">+{line.order} {line.unit}</td>
                    <td className="py-3 text-slate-600">{line.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>Draft based on demo signals · not yet sent to your ERP</span>
            <button type="button" onClick={approveOrder} disabled={orderApproved} className="min-h-11 rounded-xl bg-[#10271f] px-4 text-xs font-extrabold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-emerald-800">
              {orderApproved ? "Approved · PO-KE-2048" : "Approve & send to ERP"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
