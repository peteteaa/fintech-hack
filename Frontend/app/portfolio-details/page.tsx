"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  ArrowLeft,
  PieChart,
  TrendingUp,
  DollarSign,
  Shield,
  Loader2,
  Building2,
  Coins,
  Banknote,
  LineChart,
  LucideProps
} from "lucide-react"
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend } from "recharts"

// Mock ThemeToggle component
const ThemeToggle = () => (
  <Button variant="outline" size="sm">
    Theme
  </Button>
)

// Define types for asset data
type AssetType = 'Stocks' | 'Bonds' | 'ETFs' | 'Cryptocurrency' | 'Crypto';

interface AssetData {
  name: string;
  value: number;
  fill: string;
  icon: React.FC<LucideProps>;
  items?: string[];
}

// Icons for different asset types
const assetIcons: Record<AssetType, React.FC<LucideProps>> = {
  Stocks: TrendingUp,
  Bonds: Banknote,
  ETFs: LineChart,
  Cryptocurrency: Coins,
  Crypto: Coins
}

// Colors for different asset types
const assetColors: Record<AssetType, string> = {
  Stocks: "#3b82f6",
  Bonds: "#8b5cf6",
  ETFs: "#06b6d4",
  Cryptocurrency: "#f59e0b",
  Crypto: "#f59e0b"
}

const chartConfig = {
  value: {
    label: "Percentage",
  },
} satisfies ChartConfig

export default function Page() {
  const [json, setJson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/latest.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
        return res.json()
      })
      .then((data) => {
        setJson(data)
        setLoading(false)
        try {
          localStorage.setItem("latestPortfolio", JSON.stringify(data))
        } catch (e) {
          // Ignore localStorage errors
        }
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Loading Portfolio</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center">Fetching your portfolio details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-700 dark:text-red-400">Error Loading Portfolio</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <Button onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalValue = json?.investment_amount ? Number.parseInt(json.investment_amount) : 100000

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm dark:border-slate-700 transition-colors sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PortfolioAI
            </span>
          </Button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Portfolio Overview
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {json && (
          <div className="space-y-8">
            {/* Portfolio Header Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PieChart className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4">{json.portfolio_name || "My Portfolio"}</CardTitle>
                <div className="flex justify-center gap-4 mb-6">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    <Shield className="h-4 w-4 mr-2" />
                    {json.risk_level || "Moderate"} risk
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-4 py-2">
                    <DollarSign className="h-4 w-4 mr-2" />${totalValue.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8">
                  {json.allocation || "Diversified portfolio allocation across multiple asset classes"}
                </p>

                {/* Main Portfolio Allocation Chart */}
                {(() => {
                  // Parse allocation data from JSON
                  const allocation = json?.allocation || "";
                  
                  // Extract percentages from allocation string (e.g., "50% Stocks, 30% Bonds, 10% Cryptocurrency, 10% ETFs")
                  const chartData: AssetData[] = [];
                  const allocationRegex = /(\d+)%\s+([A-Za-z]+)/g;
                  let match: RegExpExecArray | null;
                  
                  while ((match = allocationRegex.exec(allocation)) !== null) {
                    const value = parseInt(match[1], 10);
                    const name = match[2];
                    // Use type assertion to handle the dynamic property access
                    const assetType = name as AssetType;
                    const icon = assetType in assetIcons ? assetIcons[assetType] : TrendingUp;
                    const fill = assetType in assetColors ? assetColors[assetType] : "#3b82f6";
                    
                    chartData.push({
                      name,
                      value,
                      fill,
                      icon
                    });
                  }
                  
                  // If no allocation data was found, use default values
                  if (chartData.length === 0) {
                    chartData.push(
                      { name: "Stocks", value: 60, fill: "#3b82f6", icon: TrendingUp },
                      { name: "Bonds", value: 20, fill: "#8b5cf6", icon: Banknote },
                      { name: "ETFs", value: 10, fill: "#06b6d4", icon: LineChart },
                      { name: "Crypto", value: 10, fill: "#f59e0b", icon: Coins }
                    );
                  }
                  
                  return (
                    <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4 text-white">Portfolio Breakdown</h3>
                      <div className="h-80">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={140}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {chartData.map((entry, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartTooltip
                                content={<ChartTooltipContent formatter={(value) => [`${value}%`, "Allocation"]} />}
                              />
                              <Legend
                                wrapperStyle={{ color: "white" }}
                                iconType="circle"
                                formatter={(value) => <span style={{ color: "white" }}>{value}</span>}
                              />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </div>
                  );
                })()}
              </CardHeader>
            </Card>

            {/* Helper function to extract asset-specific data from JSON */}
            {(() => {
              const allocation = json?.allocation || "";
              
              // Extract percentages from allocation string (e.g., "70% Stocks, 10% Bonds, 15% Cryptocurrency, 5% ETFs")
              const allocationData: AssetData[] = [];
              const allocationRegex = /(\d+)%\s+([A-Za-z]+)/g;
              let match: RegExpExecArray | null;
              
              while ((match = allocationRegex.exec(allocation)) !== null) {
                const value = parseInt(match[1], 10);
                const name = match[2];
                // Use type assertion to handle the dynamic property access
                const icon = (name as string in assetIcons) ? assetIcons[name as AssetType] : TrendingUp;
                const fill = (name as string in assetColors) ? assetColors[name as AssetType] : "#3b82f6";
                
                allocationData.push({
                  name,
                  value,
                  fill,
                  icon
                });
              }
              
              // If no allocation data was found, use default values
              if (allocationData.length === 0) {
                allocationData.push(
                  { name: "Stocks", value: 60, fill: "#3b82f6", icon: TrendingUp },
                  { name: "Bonds", value: 20, fill: "#8b5cf6", icon: Banknote },
                  { name: "ETFs", value: 10, fill: "#06b6d4", icon: LineChart },
                  { name: "Crypto", value: 10, fill: "#f59e0b", icon: Coins }
                );
              }
              
              // Extract relevant data from the raw text
              const rawText = json?.response_json?.data?.response_json?.raw_text || ""
              
              // Extract stocks data
              const stocksSection = rawText.match(/### 1\.[\s\S]*?(?=### 2\.)/)
              const stocksData = stocksSection ? stocksSection[0].split('\n').filter((line: string) => 
                line.includes('**') && line.includes('-')
              ).map((line: string) => line.trim().replace(/^\s*-\s*/, '')) : []
              
              // Extract bonds data
              const bondsSection = rawText.match(/### 2\.[\s\S]*?(?=### 3\.)/)
              const bondsData = bondsSection ? bondsSection[0].split('\n').filter((line: string) => 
                line.includes('**') && line.includes('-')
              ).map((line: string) => line.trim().replace(/^\s*-\s*/, '')) : []
              
              // Extract crypto data
              const cryptoSection = rawText.match(/### 3\.[\s\S]*?(?=### 4\.)/)
              const cryptoData = cryptoSection ? cryptoSection[0].split('\n').filter((line: string) => 
                line.includes('**') && line.includes('-')
              ).map((line: string) => line.trim().replace(/^\s*-\s*/, '')) : []
              
              // Extract ETFs data
              const etfsSection = rawText.match(/### 4\.[\s\S]*?(?=### Summary|$)/)
              const etfsData = etfsSection ? etfsSection[0].split('\n').filter((line: string) => 
                line.includes('**') && line.includes('-')
              ).map((line: string) => line.trim().replace(/^\s*-\s*/, '')) : []
              
              // Add item data to allocation data
              const assetData = allocationData.map(asset => {
                if (asset.name === "Stocks") {
                  return { ...asset, items: stocksData };
                } else if (asset.name === "Bonds") {
                  return { ...asset, items: bondsData };
                } else if (asset.name === "ETFs") {
                  return { ...asset, items: etfsData };
                } else if (asset.name === "Cryptocurrency" || asset.name === "Crypto") {
                  return { ...asset, items: cryptoData };
                }
                return { ...asset, items: [] };
              });
              
              return (
                <div className="grid md:grid-cols-2 gap-6">
                  {assetData.map((asset, index) => {
                    const IconComponent = asset.icon
                    const assetValue = (totalValue * asset.value) / 100

                    return (
                      <Card
                        key={index}
                        className="shadow-lg border-0 bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${asset.fill}20` }}
                              >
                                <IconComponent className="h-6 w-6" style={{ color: asset.fill }} />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{asset.name}</CardTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{asset.value}% allocation</p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Value</span>
                              <span className="font-semibold text-lg">${assetValue.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${asset.value}%`,
                                  backgroundColor: asset.fill,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span>Target: {asset.value}%</span>
                              <span>Current: {asset.value}%</span>
                            </div>
                          </div>
                          
                          {/* Top Investments */}
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">Top {asset.name}</h4>
                            <ul className="space-y-1.5 text-sm">
                              {asset.items && asset.items.length > 0 ? (
                                asset.items.slice(0, 3).map((item: string, i: number) => (
                                  <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <span dangerouslySetInnerHTML={{ 
                                      __html: item
                                        .replace(/\*\*([^*]+)\*\*/g, '<span class="font-semibold">$1</span>')
                                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
                                    }} />
                                  </li>
                                ))
                              ) : (
                                <li className="text-slate-500 dark:text-slate-400 italic">No specific recommendations</li>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )
            })()}


            {/* Portfolio Summary */}
            <Card className="shadow-lg border-0 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  Portfolio Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      ${totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Portfolio Value</div>
                  </div>
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {(() => {
                        const allocation = json?.allocation || "";
                        const regex = /(\d+)%\s+([A-Za-z]+)/g;
                        let count = 0;
                        while (regex.exec(allocation) !== null) count++;
                        return count || 4; // Default to 4 if none found
                      })()}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Asset Classes</div>
                  </div>
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {json.risk_level || "Moderate"}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Risk Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
