export async function GET() {
  return Response.json({
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
        type: "Demo logged",
        village: "Mombasa North",
        promoter: "Asha N.",
        details: "30-second voice note captured and GPS verified",
        status: "verified",
      },
      {
        type: "Stock alert",
        village: "Kisumu East",
        promoter: "Joseph K.",
        details: "Demand spike predicted for Maize herbicide bundle",
        status: "queued",
      },
      {
        type: "Farmer referral",
        village: "Nakuru South",
        promoter: "Miriam T.",
        details: "12 coupon redemptions linked to field demo attribution",
        status: "attributed",
      },
    ],
    inventory: [
      { region: "Nairobi", product: "Maize Herbicide", stockDays: 7, forecast: 34 },
      { region: "Kisumu", product: "Seed Booster", stockDays: 12, forecast: 18 },
      { region: "Nakuru", product: "Fertilizer Blend", stockDays: 5, forecast: 49 },
    ],
  });
}

type SyncReport = {
  id: string;
  kind: "voice" | "photo";
  createdAt: string;
  village: string;
  latitude: number;
  longitude: number;
};

function isSyncReport(value: unknown): value is SyncReport {
  if (typeof value !== "object" || value === null) return false;
  const report = value as Record<string, unknown>;
  return (
    typeof report.id === "string" &&
    report.id.length > 0 &&
    (report.kind === "voice" || report.kind === "photo") &&
    typeof report.createdAt === "string" &&
    !Number.isNaN(Date.parse(report.createdAt)) &&
    typeof report.village === "string" &&
    report.village.length <= 120 &&
    typeof report.latitude === "number" &&
    Number.isFinite(report.latitude) &&
    report.latitude >= -90 &&
    report.latitude <= 90 &&
    typeof report.longitude === "number" &&
    Number.isFinite(report.longitude) &&
    report.longitude >= -180 &&
    report.longitude <= 180
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    throw error;
  }

  if (typeof payload !== "object" || payload === null || !("reports" in payload)) {
    return Response.json({ error: "A reports array is required." }, { status: 400 });
  }

  const reports = (payload as { reports: unknown }).reports;
  if (!Array.isArray(reports) || reports.length > 100 || !reports.every(isSyncReport)) {
    return Response.json({ error: "Reports must contain up to 100 valid field entries." }, { status: 400 });
  }

  return Response.json({
    acceptedIds: reports.map((report) => report.id),
    acceptedCount: reports.length,
    syncedAt: new Date().toISOString(),
    mode: "mock",
  });
}
