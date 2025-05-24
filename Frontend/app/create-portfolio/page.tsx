"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreatePortfolioPage() {
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [allocation, setAllocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await fetch("http://localhost:8000/api/user-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investment_amount: investmentAmount,
          allocation: allocation,
        }),
      })
      
      const data = await res.json()
      setResponse(data)
      
      if (data.success) {
        alert("Success! Your portfolio has been created and submitted.")
      } else {
        alert(`Error: ${data.message || "Failed to create portfolio"}`)
      }
    } catch (error) {
      console.error("Error submitting portfolio:", error)
      alert("Error: Failed to connect to the server")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/portfolio-options" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Portfolio Options
      </Link>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Custom Portfolio</CardTitle>
          <CardDescription>
            Specify your investment amount and desired asset allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="investment-amount">Investment Amount</Label>
              <Input
                id="investment-amount"
                placeholder="e.g., 2000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the amount you want to invest (in USD)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allocation">Asset Allocation</Label>
              <Textarea
                id="allocation"
                placeholder="e.g., 20% ETF, 40% Crypto, 40% Stocks"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
                required
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Specify how you want to allocate your investment across different asset classes
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Portfolio..." : "Create Portfolio"}
            </Button>
          </form>
          
          {response && (
            <div className="mt-8 p-4 border rounded-md">
              <h3 className="font-medium mb-2">Response:</h3>
              <pre className="text-sm bg-muted p-2 rounded overflow-auto max-h-[300px]">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
