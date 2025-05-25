import fs from 'fs';
import path from 'path';

// Returns the filename of the latest portfolio JSON in /public
export function getLatestPortfolioFilename(): string | null {
  const publicDir = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir);
  const portfolioFiles = files.filter(f => f.startsWith('portfolio_') && f.endsWith('.json'));
  if (portfolioFiles.length === 0) return null;
  // Sort by timestamp in filename
  portfolioFiles.sort((a, b) => {
    const aMatch = a.match(/portfolio_(\d+)_\d+\.json/);
    const bMatch = b.match(/portfolio_(\d+)_\d+\.json/);
    if (!aMatch || !bMatch) return 0;
    return Number(bMatch[1]) - Number(aMatch[1]);
  });
  return portfolioFiles[0];
}
