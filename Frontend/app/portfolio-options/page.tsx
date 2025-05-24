"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, ArrowLeft, ArrowRight, Check, TrendingUp, Shield, Target } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Pie } from "recharts"
import Link from "next/link"
// We'll use an API route instead of direct file system access

interface PortfolioOption {
  id: string
  name: string
  description: string
  riskLevel: "Conservative" | "Moderate" | "Aggressive"
  expectedReturn: string
  icon: React.ReactNode
  data: Array<{
    name: string
    value: number
    fill: string
  }>
  features: string[]
}

interface GeneratedPortfolio {
  name: string
  risk_level: string
  asset_allocation: Record<string, number>
}

// Function to get chart colors based on index
const getChartColor = (index: number): string => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ];
  return colors[index % colors.length];
};

// Function to get expected return based on risk level
const getExpectedReturn = (riskLevel: string): string => {
  switch (riskLevel) {
    case "low":
      return "4-6%";
    case "medium":
      return "6-8%";
    case "high":
      return "8-12%";
    default:
      return "5-8%";
  }
};

// Function to get features based on risk level
const getFeatures = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case "low":
      return ["Low volatility", "Capital preservation focus", "Steady dividend income", "Minimal risk exposure"];
    case "medium":
      return ["Balanced risk-return", "Global diversification", "Growth with stability", "Regular rebalancing"];
    case "high":
      return ["Maximum growth potential", "Higher volatility", "Long-term focus", "Equity-heavy allocation"];
    default:
      return ["Diversified allocation", "Professional management", "Regular rebalancing", "Tax efficiency"];
  }
};

// Function to get icon based on risk level
const getRiskIcon = (riskLevel: string): React.ReactNode => {
  switch (riskLevel) {
    case "low":
      return <Shield className="h-6 w-6" />;
    case "medium":
      return <Target className="h-6 w-6" />;
    case "high":
      return <TrendingUp className="h-6 w-6" />;
    default:
      return <PieChart className="h-6 w-6" />;
  }
};

// Function to convert risk level to UI display format
const formatRiskLevel = (riskLevel: string): "Conservative" | "Moderate" | "Aggressive" => {
  switch (riskLevel) {
    case "low":
      return "Conservative";
    case "medium":
      return "Moderate";
    case "high":
      return "Aggressive";
    default:
      return "Moderate";
  }
};

export default function PortfolioOptionsPage() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showApiResponse, setShowApiResponse] = useState<boolean>(false);
  const [generatedPortfolios, setGeneratedPortfolios] = useState<GeneratedPortfolio[]>([]);
  const [portfolioOptions, setPortfolioOptions] = useState<PortfolioOption[]>([]);

  // Fetch the generated portfolios data
  useEffect(() => {
    // Fetch portfolio data from our API
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/portfolios');
        const data = await response.json();
        
        if (data.portfolios) {
          setGeneratedPortfolios(data.portfolios);
          
          // Transform the generated portfolios into the format needed for the UI
          const options: PortfolioOption[] = data.portfolios.map((portfolio: GeneratedPortfolio) => {
            // Create data array for pie chart from asset allocation
            const chartData = Object.entries(portfolio.asset_allocation).map(([name, value], i) => ({
              name,
              value,
              fill: getChartColor(i)
            }));
            
            return {
              id: portfolio.risk_level,
              name: portfolio.name,
              description: getPortfolioDescription(portfolio.risk_level),
              riskLevel: formatRiskLevel(portfolio.risk_level),
              expectedReturn: getExpectedReturn(portfolio.risk_level),
              icon: getRiskIcon(portfolio.risk_level),
              data: chartData,
              features: getFeatures(portfolio.risk_level)
            };
          });
          
          setPortfolioOptions(options);
        } else {
          // Fallback to default options if API doesn't return expected data
          setPortfolioOptions(defaultPortfolioOptions);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        // Fallback to default options if API fails
        setPortfolioOptions(defaultPortfolioOptions);
      }
    };
    
    fetchPortfolios();
  }, []);
  
  // Helper function to get portfolio description
  const getPortfolioDescription = (riskLevel: string): string => {
    switch (riskLevel) {
      case "low":
        return "Low-risk portfolio focused on capital preservation with steady, modest returns";
      case "medium":
        return "Well-balanced portfolio offering moderate risk with solid long-term growth potential";
      case "high":
        return "High-growth portfolio designed for maximum long-term returns with higher risk tolerance";
      default:
        return "Balanced portfolio designed for long-term growth";
    }
  };

  // Default portfolio options as fallback
  const defaultPortfolioOptions: PortfolioOption[] = [
    {
      id: "conservative",
      name: "Conservative Growth",
      description: "Low-risk portfolio focused on capital preservation with steady, modest returns",
      riskLevel: "Conservative",
      expectedReturn: "4-6%",
      icon: <Shield className="h-6 w-6" />,
      data: [
        { name: "Government Bonds", value: 40, fill: "hsl(var(--chart-1))" },
        { name: "Corporate Bonds", value: 30, fill: "hsl(var(--chart-2))" },
        { name: "Large Cap Stocks", value: 20, fill: "hsl(var(--chart-3))" },
        { name: "REITs", value: 10, fill: "hsl(var(--chart-4))" },
      ],
      features: ["Low volatility", "Capital preservation focus", "Steady dividend income", "Minimal risk exposure"],
    },
    {
      id: "moderate",
      name: "Balanced Growth",
      description: "Well-balanced portfolio offering moderate risk with solid long-term growth potential",
      riskLevel: "Moderate",
      expectedReturn: "6-8%",
      icon: <Target className="h-6 w-6" />,
      data: [
        { name: "Large Cap Stocks", value: 35, fill: "hsl(var(--chart-1))" },
        { name: "Corporate Bonds", value: 25, fill: "hsl(var(--chart-2))" },
        { name: "International Stocks", value: 20, fill: "hsl(var(--chart-3))" },
        { name: "REITs", value: 15, fill: "hsl(var(--chart-4))" },
        { name: "Government Bonds", value: 5, fill: "hsl(var(--chart-5))" },
      ],
      features: ["Balanced risk-return", "Global diversification", "Growth with stability", "Regular rebalancing"],
    },
    {
      id: "aggressive",
      name: "Growth Focused",
      description: "High-growth portfolio designed for maximum long-term returns with higher risk tolerance",
      riskLevel: "Aggressive",
      expectedReturn: "8-12%",
      icon: <TrendingUp className="h-6 w-6" />,
      data: [
        { name: "Growth Stocks", value: 40, fill: "hsl(var(--chart-1))" },
        { name: "Large Cap Stocks", value: 25, fill: "hsl(var(--chart-2))" },
        { name: "International Stocks", value: 20, fill: "hsl(var(--chart-3))" },
        { name: "Small Cap Stocks", value: 10, fill: "hsl(var(--chart-4))" },
        { name: "Corporate Bonds", value: 5, fill: "hsl(var(--chart-5))" },
      ],
      features: ["Maximum growth potential", "Higher volatility", "Long-term focus", "Equity-heavy allocation"],
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Conservative":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Aggressive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  // Function to submit portfolio selection to the API
  const submitPortfolioSelection = async (portfolioId: string) => {
    setIsSubmitting(true);
    
    try {
      const selectedOption = portfolioOptions.find((p: PortfolioOption) => p.id === portfolioId);
      
      if (selectedOption) {
        // Get the original portfolio data with asset allocation
        const portfolioData = generatedPortfolios.find(
          (p: GeneratedPortfolio) => p.risk_level === portfolioId
        );
        
        if (portfolioData) {
          // Format the allocation as a string for the API
          // Format should be like: "20%ETF, 40%crypto, 40% stock"
          const allocationString = Object.entries(portfolioData.asset_allocation)
            .filter(([_, percentage]) => percentage > 0) // Only include assets with non-zero allocation
            .map(([asset, percentage]) => `${percentage}% ${asset}`)
            .join(', ');
          
          // Default investment amount - could be customized in the future
          const investmentAmount = "2000";
          
          // Enhanced debugging for API calls
          console.log('\n==== TOOLHOUSE API CALL FROM FRONTEND (SELECTION) ====');
          console.log(`Portfolio Name: ${portfolioData.name}`);
          console.log(`Risk Level: ${portfolioData.risk_level}`);
          console.log(`Investment Amount (var1): ${investmentAmount}`);
          console.log(`Allocation (var2): ${allocationString}`);
          console.log('Payload:', {
            investment_amount: investmentAmount,
            allocation: allocationString,
            portfolio_name: portfolioData.name,
            risk_level: portfolioData.risk_level
          });
          
          // Send to our backend API with portfolio details
          const response = await fetch('http://localhost:8000/api/user-portfolio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              investment_amount: investmentAmount,
              allocation: allocationString,
              portfolio_name: portfolioData.name,
              risk_level: portfolioData.risk_level
            }),
          });
          
          const result = await response.json();
          setSubmissionResult(result);
          
          if (result.success) {
            console.log(`Successfully submitted ${selectedOption.name} portfolio`);
          } else {
            console.error(`Error submitting portfolio: ${result.message}`);
          }
        }
      }
    } catch (error) {
      console.error('Error submitting portfolio selection:', error);
      setSubmissionResult({ success: false, message: 'Failed to submit portfolio' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle portfolio selection - just update the selected portfolio state
  const handlePortfolioSelection = (portfolioId: string) => {
    setSelectedPortfolio(portfolioId);
    // No longer calling the API here
  };
  
  // Handle continue button click - call the test API endpoint
  const handleContinue = async () => {
    if (selectedPortfolio) {
      const selectedOption = portfolioOptions.find((p: PortfolioOption) => p.id === selectedPortfolio);
      
      if (selectedOption) {
        try {
          // Get the original portfolio data with asset allocation
          const portfolioData = generatedPortfolios.find(
            (p: GeneratedPortfolio) => p.risk_level === selectedPortfolio
          );
          
          if (portfolioData) {
            // Format the allocation as a string for the API
            const allocationString = Object.entries(portfolioData.asset_allocation)
              .filter(([_, percentage]) => percentage > 0) // Only include assets with non-zero allocation
              .map(([asset, percentage]) => `${percentage}% ${asset}`)
              .join(', ');
            
            // Default investment amount - could be customized in the future
            const investmentAmount = "2000";
            
            // Call the test API endpoint with enhanced debugging
            console.log('\n==== TOOLHOUSE API CALL FROM FRONTEND (CONTINUE BUTTON) ====');
            console.log(`Portfolio Name: ${portfolioData.name}`);
            console.log(`Risk Level: ${portfolioData.risk_level}`);
            console.log(`Investment Amount (var1): ${investmentAmount}`);
            console.log(`Allocation (var2): ${allocationString}`);
            console.log('Payload:', {
              investment_amount: investmentAmount,
              allocation: allocationString,
              portfolio_name: portfolioData.name,
              risk_level: portfolioData.risk_level
            });
            console.log("Calling test API endpoint...");
            setIsSubmitting(true);
            
            const response = await fetch('http://localhost:8000/api/test-api', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                investment_amount: investmentAmount,
                allocation: allocationString,
                portfolio_name: portfolioData.name,
                risk_level: portfolioData.risk_level
              }),
            });
            
            const result = await response.json();
            
            // Store the API response to display on the page
            setApiResponse(result);
            setShowApiResponse(true);
            
            if (result.success) {
              console.log("Test API call successful for portfolio!");
              console.log("Test API result:", result);
            } else {
              console.error("Test API call failed:", result.message);
              console.error("Test API error:", result);
            }
          }
        } catch (error) {
          console.error('Error calling test API:', error);
          alert(`Error calling test API. Please check the console for details.`);
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/invest" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant="outline">Step 2 of 3</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Choose Your Investment Strategy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Select the portfolio that best matches your risk tolerance and investment goals. Each option is
            professionally designed using AI and automatically managed.
          </p>
        </div>

        {portfolioOptions.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {portfolioOptions.map((portfolio: PortfolioOption) => (
            <Card
              key={portfolio.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedPortfolio === portfolio.id
                  ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-105"
                  : "hover:scale-102"
              } bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
              onClick={() => handlePortfolioSelection(portfolio.id)}
            >
              <CardHeader className="text-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">{portfolio.icon}</div>
                  {selectedPortfolio === portfolio.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{portfolio.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={getRiskColor(portfolio.riskLevel)}>{portfolio.riskLevel}</Badge>
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    {portfolio.expectedReturn} annually
                  </Badge>
                </div>
                <CardDescription className="dark:text-gray-300">{portfolio.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Pie Chart */}
                <div className="h-64 mb-6">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Allocation",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={portfolio.data}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {portfolio.data.map((entry, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          formatter={(value: any) => [`${value}%`, "Allocation"]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Asset Breakdown */}
                <div className="space-y-2 mb-6">
                  {portfolio.data.map((asset, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.fill }} />
                        <span className="text-gray-700 dark:text-gray-300">{asset.name}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{asset.value}%</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {portfolio.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Loading portfolio options...</p>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              className="px-8 py-6 text-lg"
              onClick={handleContinue}
              disabled={!selectedPortfolio || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Continue"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Display API Response */}
        {showApiResponse && apiResponse && (
          <div className="mt-12 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Toolhouse API Response</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Selected Portfolio</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">Portfolio Name:</p>
                  <p className="text-gray-600 dark:text-gray-300">{apiResponse.data?.portfolio_name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Risk Level:</p>
                  <p className="text-gray-600 dark:text-gray-300">{apiResponse.data?.risk_level || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Investment Amount:</p>
                  <p className="text-gray-600 dark:text-gray-300">${apiResponse.data?.investment_amount || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Allocation:</p>
                  <p className="text-gray-600 dark:text-gray-300">{apiResponse.data?.allocation || "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">API Call Details</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <p className="font-medium">Status: <span className={apiResponse.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {apiResponse.success ? "Success" : "Failed"}
                </span></p>
                <p className="font-medium">Message: <span className="text-gray-600 dark:text-gray-300">{apiResponse.message}</span></p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Raw Response</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto max-h-60 text-sm">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Don't worry, you can always change this later
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your portfolio will be automatically rebalanced and optimized based on market conditions and your goals.
                You can adjust your strategy anytime through your dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
