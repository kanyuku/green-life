"use client";

import { useEffect, useRef, useState } from "react";
import {
  deleteQueuedReport,
  listQueuedReports,
  saveQueuedReport,
  type QueueItem,
} from "@/lib/field-demo";

type PromoterTab = "capture" | "queue" | "coupon";

const demoLocation = { latitude: -1.2921, longitude: 36.8219, label: "Kibera demo plot · Nairobi County" };
const waveform = [18, 30, 22, 52, 33, 75, 43, 61, 28, 89, 46, 70, 38, 58, 24, 76, 35, 92, 48, 64, 30, 72, 42, 84, 26, 56, 38, 68, 32, 80, 46, 60, 25, 74, 40, 88, 34, 66, 22, 50, 37, 78, 42, 60, 28, 86, 45, 70];

function makeCouponCode(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return `PULSE-${values[0].toString(36).toUpperCase().slice(0, 6)}`;
}

function makePromoterId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export default function PromoterPage() {
  const [tab, setTab] = useState<PromoterTab>("capture");
  const [reports, setReports] = useState<QueueItem[]>([]);
  const [village, setVillage] = useState("Kibera");
  const [fieldNote, setFieldNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoStamp, setPhotoStamp] = useState("");
  const [coupon, setCoupon] = useState("");
  const [promoterId, setPromoterId] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [couponSent, setCouponSent] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const fieldNoteRef = useRef(fieldNote);
  const pressHeldRef = useRef(false);

  useEffect(() => {
    fieldNoteRef.current = fieldNote;
  }, [fieldNote]);

  useEffect(() => {
    void refreshReports();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!photoPreview) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  async function refreshReports() {
    try {
      setReports(await listQueuedReports());
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load reports stored on this device.");
    }
  }

  async function persistReport(report: QueueItem, successMessage: string) {
    try {
      await saveQueuedReport(report);
      await refreshReports();
      setMessage(successMessage);
      setError("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "This report could not be saved.");
    }
  }

  async function startRecording() {
    if (recording) return;
    setError("");
    setMessage("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording is not supported in this browser. Try a current mobile browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!pressHeldRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      recorder.onstop = () => {
        const audio = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (audio.size) {
          void persistReport(
            {
              id: crypto.randomUUID(),
              kind: "voice",
              createdAt: new Date().toISOString(),
              village,
              note: fieldNoteRef.current.trim() || "Voice field update",
              latitude: demoLocation.latitude,
              longitude: demoLocation.longitude,
              attachment: audio,
              fileName: "field-update.webm",
            },
            "Voice update saved to this device.",
          );
        } else {
          setError("No audio was recorded. Hold the button while speaking, then try again.");
        }
      };
      recorderRef.current = recorder;
      recorder.start();
      startedAtRef.current = Date.now();
      setElapsed(0);
      setRecording(true);
      timerRef.current = setInterval(() => {
        const seconds = Math.min(30, Math.floor((Date.now() - startedAtRef.current) / 1000));
        setElapsed(seconds);
        if (seconds >= 30) stopRecording();
      }, 250);
    } catch (caught) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(caught instanceof Error ? `Microphone unavailable: ${caught.message}` : "Microphone permission was not granted.");
    }
  }

  function stopRecording() {
    pressHeldRef.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setElapsed(Math.min(30, Math.floor((Date.now() - startedAtRef.current) / 1000)));
    setRecording(false);
  }

  async function capturePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const photo = input.files?.[0];
    if (!photo) return;
    const capturedAt = new Date();
    setPhotoPreview(URL.createObjectURL(photo));
    setPhotoStamp(capturedAt.toLocaleString());
    input.value = "";
    await persistReport(
      {
        id: crypto.randomUUID(),
        kind: "photo",
        createdAt: capturedAt.toISOString(),
        village,
        note: `Plot photo · ${demoLocation.label}`,
        latitude: demoLocation.latitude,
        longitude: demoLocation.longitude,
        attachment: photo,
        fileName: photo.name,
      },
      `Photo queued · ${capturedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    );
  }

  async function syncReports() {
    if (!reports.length || syncing) return;
    if (!navigator.onLine) {
      setError("You are offline. Reports are safe on this device and will sync when connected.");
      return;
    }
    setSyncing(true);
    setError("");
    setMessage("");
    window.dispatchEvent(new Event("field-demo-sync-start"));
    try {
      const response = await fetch("/api/field-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reports: reports.map(({ id, kind, createdAt, village: reportVillage, latitude, longitude }) => ({
            id,
            kind,
            createdAt,
            village: reportVillage,
            latitude,
            longitude,
          })),
        }),
      });
      if (!response.ok) throw new Error("The sync service could not accept these reports.");
      const acknowledgement: unknown = await response.json();
      const acceptedIds =
        typeof acknowledgement === "object" && acknowledgement !== null && "acceptedIds" in acknowledgement
          ? acknowledgement.acceptedIds
          : undefined;
      if (
        !Array.isArray(acceptedIds) ||
        !acceptedIds.every((id: unknown) => typeof id === "string") ||
        !reports.every((report) => acceptedIds.includes(report.id))
      ) {
        throw new Error("The sync service returned an incomplete acknowledgement. Reports remain in the local queue.");
      }
      await Promise.all(reports.map((report) => deleteQueuedReport(report.id)));
      await refreshReports();
      setMessage(`Mock sync acknowledged ${reports.length} report${reports.length === 1 ? "" : "s"}. Attachments are not uploaded to a backend.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sync failed. Your reports remain saved on this device.");
    } finally {
      setSyncing(false);
      window.dispatchEvent(new Event("field-demo-sync-end"));
    }
  }

  function generateCoupon() {
    const code = makeCouponCode();
    const id = makePromoterId();
    try {
      localStorage.setItem("field-demo-coupon", JSON.stringify({ code, promoterId: id, used: false }));
    } catch (caught) {
      setError(caught instanceof Error ? `Coupon could not be saved in this browser: ${caught.message}` : "Coupon could not be saved in this browser.");
      return;
    }
    setCoupon(code);
    setPromoterId(id);
    setCouponSent(false);
    setMessage("");
    setError("");
  }

  const tabs: { id: PromoterTab; label: string }[] = [
    { id: "capture", label: "Field capture" },
    { id: "queue", label: `Pending sync${reports.length ? ` · ${reports.length}` : ""}` },
    { id: "coupon", label: "Farmer coupon" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pb-12">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Promoter workspace</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Field visit</h1>
          <p className="mt-1 text-sm text-slate-600">Capture what happened at the plot. It will save even without network.</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          Village
          <input
            value={village}
            onChange={(event) => setVillage(event.target.value)}
            className="w-36 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-950 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            aria-label="Village name"
          />
        </label>
      </header>

      <div role="tablist" aria-label="Promoter tasks" className="mb-5 grid grid-cols-3 rounded-2xl border border-slate-200 bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`min-h-11 rounded-xl px-2 text-xs font-bold transition sm:text-sm ${
              tab === item.id ? "bg-[#10271f] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{message}</p>}
      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">{error}</p>}

      {tab === "capture" && (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Voice note</p>
                <h2 className="mt-2 text-xl font-extrabold">What did farmers tell you?</h2>
                <p className="mt-1 text-sm text-slate-600">Speak in Swahili or English. Maximum 30 seconds.</p>
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-sm font-bold tabular-nums">{`00:${String(elapsed).padStart(2, "0")}`}</span>
            </div>

            <div aria-hidden="true" className="my-7 flex h-20 items-center justify-center gap-[3px] overflow-hidden rounded-2xl bg-[#10271f] px-3">
              {waveform.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`w-1 rounded-full bg-emerald-300 transition-all ${recording ? "animate-pulse" : "opacity-55"}`}
                  style={{ height: `${height}%`, animationDelay: `${index * 17}ms` }}
                />
              ))}
            </div>

            <button
              type="button"
              onPointerDown={(event) => {
                if (event.pointerType === "mouse" && event.button !== 0) return;
                event.preventDefault();
                pressHeldRef.current = true;
                void startRecording();
              }}
              onPointerUp={stopRecording}
              onPointerCancel={stopRecording}
              onContextMenu={(event) => event.preventDefault()}
              aria-label={recording ? "Release to save voice update" : "Hold to record a voice update"}
              className={`flex min-h-20 w-full touch-none items-center justify-center gap-3 rounded-2xl px-5 text-lg font-black text-white shadow-lg transition active:scale-[0.99] ${
                recording ? "bg-rose-600 shadow-rose-200" : "bg-emerald-700 shadow-emerald-200 hover:bg-emerald-800"
              }`}
            >
              <span className={`h-3 w-3 rounded-full bg-white ${recording ? "animate-ping" : ""}`} />
              {recording ? "Recording · release to save" : "Hold to record"}
            </button>
            <p className="mt-2 text-center text-xs font-medium text-slate-500">Press and hold while speaking · auto-stops at 30 sec</p>

            <label className="mt-6 block text-sm font-bold text-slate-800" htmlFor="field-note">
              Quick note <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="field-note"
              value={fieldNote}
              onChange={(event) => setFieldNote(event.target.value)}
              placeholder="Attendance, crop concerns, product used..."
              rows={3}
              className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Plot evidence</p>
            <h2 className="mt-2 text-xl font-extrabold">Add a geotagged photo</h2>
            <p className="mt-1 text-sm text-slate-600">Photo stays on this device until you sync.</p>

            <label className="mt-5 flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:border-emerald-500 hover:bg-emerald-50">
              {photoPreview ? (
                <span className="w-full">
                  {/* eslint-disable @next/next/no-img-element */}
                  <img src={photoPreview} alt="Captured field plot" className="max-h-52 w-full rounded-xl object-cover" />
                  {/* eslint-enable @next/next/no-img-element */}
                  <span className="mt-2 block text-xs font-semibold text-slate-700">Captured {photoStamp}</span>
                  <span className="mt-1 block font-mono text-[10px] text-slate-500">{demoLocation.latitude.toFixed(4)}, {demoLocation.longitude.toFixed(4)}</span>
                </span>
              ) : (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900">▧</span>
                  <span className="mt-3 text-sm font-bold">Take a plot photo</span>
                  <span className="mt-1 text-xs text-slate-500">Camera opens on supported mobile devices</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={(event) => void capturePhoto(event)} className="sr-only" aria-label="Capture field photo" />
            </label>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold">Location stamp</p>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">Demo GPS</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{demoLocation.label}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{demoLocation.latitude.toFixed(4)}° S, {demoLocation.longitude.toFixed(4)}° E</p>
              <p className="mt-1 text-xs text-slate-500">Timestamp added at capture · sample coordinates for prototype</p>
            </div>
          </section>
        </div>
      )}

      {tab === "queue" && (
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">On-device storage</p>
              <h2 className="mt-2 text-xl font-extrabold">Pending sync <span className="text-slate-400">({reports.length})</span></h2>
              <p className="mt-1 text-sm text-slate-600">Reports are stored in IndexedDB until the server confirms receipt.</p>
            </div>
            <button
              type="button"
              onClick={() => void syncReports()}
              disabled={!reports.length || syncing}
              className="min-h-12 rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {syncing ? "Syncing reports…" : "Sync now"}
            </button>
          </div>
          {reports.length ? (
            <ul className="mt-6 divide-y divide-slate-200">
              {reports.map((report) => (
                <li key={report.id} className="flex items-start gap-3 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 font-bold text-emerald-800">{report.kind === "voice" ? "♫" : "▧"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{report.kind === "voice" ? "Voice update" : "Plot photo"} · {report.village}</p>
                    <p className="mt-1 truncate text-sm text-slate-600">{report.note}</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">{new Date(report.createdAt).toLocaleString()} · {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">Queued</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <p className="font-bold">You’re all caught up</p>
              <p className="mt-1 text-sm text-slate-600">New voice notes and plot photos will appear here.</p>
            </div>
          )}
        </section>
      )}

      {tab === "coupon" && (
        <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Referral attribution</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Create a farmer coupon</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Generate a one-time demo code to share by SMS. The sample code is for prototype use and does not send an actual SMS.</p>
          <label htmlFor="farmer-phone" className="mt-6 block text-sm font-bold">Farmer phone number <span className="font-normal text-slate-500">(optional)</span></label>
          <input id="farmer-phone" inputMode="tel" value={farmerPhone} onChange={(event) => setFarmerPhone(event.target.value)} placeholder="+254 7XX XXX XXX" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
          <button type="button" onClick={generateCoupon} className="mt-4 min-h-12 w-full rounded-xl bg-emerald-700 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-800">Generate digital coupon</button>
          {coupon && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900">Farmer offer · demo coupon</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-emerald-900">Prototype</span>
              </div>
              <p className="mt-4 font-mono text-3xl font-black tracking-wider text-emerald-950">{coupon}</p>
              <p className="mt-2 text-sm text-emerald-900">Show this code at a participating agrovet to validate the referral.</p>
              <div className="mt-5 border-t border-emerald-200 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">Promoter cryptographic ID · mock</p>
                <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-800">{promoterId}</p>
              </div>
              <button type="button" onClick={() => setCouponSent(true)} className="mt-4 min-h-11 w-full rounded-xl border border-emerald-800 bg-white px-4 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100">
                {couponSent ? `SMS queued${farmerPhone ? ` for ${farmerPhone}` : ""} · demo only` : "Prepare SMS message"}
              </button>
              {couponSent && <p className="mt-2 text-center text-xs text-emerald-900">No message was sent; connect an SMS provider to enable delivery.</p>}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
