'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Summary = {
  activePromoters: number;
  demoPlots: number;
  estimatedAttendees: number;
  attributedSales: number;
  forecastedRestockValue: number;
};

type EventItem = {
  type: string;
  village: string;
  promoter: string;
  details: string;
  status: string;
};

type InventoryItem = {
  region: string;
  product: string;
  stockDays: number;
  forecast: number;
};

type DashboardData = {
  generatedAt: string;
  summary: Summary;
  events: EventItem[];
  inventory: InventoryItem[];
};

const defaultData: DashboardData = {
  generatedAt: new Date().toISOString(),
  summary: {
    activePromoters: 146,
    demoPlots: 28,
    estimatedAttendees: 3420,
    attributedSales: 1284000,
    forecastedRestockValue: 445000,
  },
  events: [
    {
      type: 'Demo logged',
      village: 'Mombasa North',
      promoter: 'Asha N.',
      details: 'Voice note synced and GPS verified',
      status: 'verified',
    },
    {
      type: 'Stock alert',
      village: 'Kisumu East',
      promoter: 'Joseph K.',
      details: 'Herbicide demand spike forecasted',
      status: 'queued',
    },
  ],
  inventory: [
    { region: 'Nairobi', product: 'Maize Herbicide', stockDays: 7, forecast: 34 },
    { region: 'Kisumu', product: 'Seed Booster', stockDays: 12, forecast: 18 },
    { region: 'Nakuru', product: 'Fertilizer Blend', stockDays: 5, forecast: 49 },
  ],
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/field-demo')
      .then((response) => response.json())
      .then((payload) => {
        setData(payload);
      })
      .catch(() => setData(defaultData))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { label: 'Active promoters', value: data.summary.activePromoters.toString() },
    { label: 'Demos logged', value: data.summary.demoPlots.toString() },
    { label: 'Farmers reached', value: data.summary.estimatedAttendees.toLocaleString() },
    { label: 'Attributable sales', value: formatCurrency(data.summary.attributedSales) },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white px-6 py-8 text-slate-800 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-[28px] border border-emerald-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">GreenLife</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">FieldDemo Pulse dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Live sync</span>
            <Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700">
              Back to overview
            </Link>
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => (
            <div key={card.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-600">{card.label}</p>
              <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Demand index</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Localized demand curve</h2>
              </div>
              <span className="text-sm font-medium text-slate-500">
                {loading ? 'Refreshing…' : new Date(data.generatedAt).toLocaleString()}
              </span>
            </div>

            <div className="mt-8 flex h-56 items-end gap-3 rounded-[22px] bg-gradient-to-b from-emerald-50 to-white p-4">
              {[42, 61, 48, 74, 85, 72, 90, 96].map((bar, index) => (
                <div key={bar + index} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[10px] font-medium text-slate-500">{['M','T','W','T','F','S','S','M'][index]}</span>
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-600 to-lime-400"
                    style={{ height: `${bar}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Quick insight</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Needs attention</h2>
            <ul className="mt-5 space-y-4">
              <li className="rounded-2xl bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">Restock alert</p>
                <p className="mt-1 text-sm text-amber-700">Nakuru South is trending 49% above baseline for fertilizer blends.</p>
              </li>
              <li className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">Attribution success</p>
                <p className="mt-1 text-sm text-emerald-700">12 coupons have been redeemed and trace back to closure events.</p>
              </li>
              <li className="rounded-2xl bg-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-800">ERP queue</p>
                <p className="mt-1 text-sm text-slate-700">3 purchase orders are pending approval from sales operations.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Field events</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Recent promoter activity</h2>

            <div className="mt-5 space-y-4">
              {data.events.map((event) => (
                <div key={`${event.village}-${event.type}`} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{event.type}</p>
                      <p className="mt-1 text-sm text-slate-600">{event.village} · {event.promoter}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {event.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{event.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Inventory forecasts</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Agrovet stock pressure</h2>

            <div className="mt-5 space-y-4">
              {data.inventory.map((item) => (
                <div key={item.region + item.product} className="rounded-[22px] border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.product}</p>
                      <p className="text-sm text-slate-500">{item.region}</p>
                    </div>
                    <span className="text-lg font-black text-slate-900">{item.forecast}%</span>
                  </div>
                  <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" style={{ width: `${item.forecast}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>{item.stockDays} days remaining</span>
                    <span>Risk level</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
