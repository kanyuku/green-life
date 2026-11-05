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
