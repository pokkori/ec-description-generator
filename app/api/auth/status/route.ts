import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const stripePremium = req.cookies.get("stripe_premium")?.value === "1";
  const payjpPremium = !!req.cookies.get("premium")?.value;
  const isPremium = stripePremium || payjpPremium;
  return NextResponse.json({ isPremium });
}
