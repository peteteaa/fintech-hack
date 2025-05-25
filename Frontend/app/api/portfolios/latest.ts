import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  const files = fs.readdirSync(publicDir);
  const portfolioFiles = files.filter((f) => f.startsWith("portfolio_") && f.endsWith(".json"));
  if (portfolioFiles.length === 0) {
    return NextResponse.json({ error: "No portfolio files found" }, { status: 404 });
  }
  // Sort by timestamp in filename (descending)
  portfolioFiles.sort((a, b) => {
    const aMatch = a.match(/portfolio_(\d+)_\d+\.json/);
    const bMatch = b.match(/portfolio_(\d+)_\d+\.json/);
    if (!aMatch || !bMatch) return 0;
    return Number(bMatch[1]) - Number(aMatch[1]);
  });
  const latestFile = portfolioFiles[0];
  const filePath = path.join(publicDir, latestFile);
  const content = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(content));
}
