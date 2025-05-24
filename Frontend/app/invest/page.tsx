"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PieChart, DollarSign, ArrowLeft, ArrowRight, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function InvestPage() {
  const [investmentAmount, setInvestmentAmount] = useState<string>("")
  const [selectedAmount, setSelectedAmount] = useState<string>("")

  const quickAmounts = [
    { label: "$1,000", value: "1000" },
    { label: "$5,000", value: "5000" },
    { label: "$10,000", value: "10000" },
    { label: "$25,000", value: "25000" },
    { label: "$50,000", value: "50000" },
    { label: "$100,000", value: "100000" },
  ]

  const handleQuickSelect = (amount: string) => {
    setInvestmentAmount(amount)
    setSelectedAmount(amount)
  }

  const handleContinue = () => {
    if (investmentAmount && Number.parseFloat(investmentAmount) > 0) {
      // Navigate to portfolio options page
      window.location.href = "/portfolio-options"
    }
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount)
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant="outline">Step 1 of 3</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            How much would you like to invest?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors">
            Tell us your investment amount and we'll create a personalized portfolio strategy just for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Amount Input */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5" />
                Investment Amount
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Enter the amount you'd like to invest to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="dark:text-gray-200">
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10,000"
                  value={investmentAmount}
                  onChange={(e) => {
                    setInvestmentAmount(e.target.value)
                    setSelectedAmount("")
                  }}
                  className="text-2xl h-14 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {investmentAmount && (
                  <p className="text-center text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(investmentAmount)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="dark:text-gray-200">Quick Select</Label>
                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map((amount) => (
                    <Button
                      key={amount.value}
                      variant={selectedAmount === amount.value ? "default" : "outline"}
                      onClick={() => handleQuickSelect(amount.value)}
                      className="h-12 hover:scale-105 transition-transform"
                    >
                      {amount.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-12 text-lg hover:scale-105 transition-transform"
                disabled={!investmentAmount || Number.parseFloat(investmentAmount) <= 0}
              >
                Continue to Portfolio Selection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You can always adjust this amount later
              </p>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Choose Portfolio Type</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Select from conservative, moderate, or aggressive investment strategies
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Portfolio Customization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Fine-tune your portfolio based on your specific goals and preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Start Investing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Review and fund your optimized portfolio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Why start today?</h4>
                </div>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Time in market beats timing the market</li>
                  <li>• Compound interest works best over time</li>
                  <li>• Professional management from day one</li>
                  <li>• Start with any amount</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
