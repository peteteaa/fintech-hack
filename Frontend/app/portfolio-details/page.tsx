"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PieChart } from "lucide-react"

// Mock ThemeToggle component (replace with actual implementation if available)
const ThemeToggle = () => (
  <Button variant="outline" size="sm">
    Theme
  </Button>
)

export default function PortfolioDetailsPage() {
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
          localStorage.setItem('latestPortfolio', JSON.stringify(data))
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Loading portfolio details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to convert raw text to formatted JSX with Markdown-like formatting
  const formatRawText = (text) => {
    if (!text) return null;
    
    // Split the text by newlines
    return text.split('\n').map((line, index) => {
      // Handle headers (###)
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-blue-700 dark:text-blue-400">{line.replace('### ', '')}</h3>;
      }
      // Handle sub-headers (##)
      else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-blue-800 dark:text-blue-300">{line.replace('## ', '')}</h2>;
      }
      // Handle bold text (**text**)
      else if (line.includes('**')) {
        const parts = [];
        let currentText = line;
        let boldStart = currentText.indexOf('**');
        let boldEnd = -1;
        let partIndex = 0;
        
        while (boldStart !== -1) {
          // Add text before the bold
          if (boldStart > 0) {
            parts.push(<span key={`${index}-${partIndex++}`}>{currentText.substring(0, boldStart)}</span>);
          }
          
          boldEnd = currentText.indexOf('**', boldStart + 2);
          if (boldEnd === -1) break;
          
          // Add the bold text
          parts.push(
            <span key={`${index}-${partIndex++}`} className="font-bold">
              {currentText.substring(boldStart + 2, boldEnd)}
            </span>
          );
          
          // Update the current text
          currentText = currentText.substring(boldEnd + 2);
          boldStart = currentText.indexOf('**');
        }
        
        // Add any remaining text
        if (currentText) {
          parts.push(<span key={`${index}-${partIndex++}`}>{currentText}</span>);
        }
        
        // Handle list items
        if (line.trim().startsWith('- ')) {
          return <li key={index} className="ml-6 mb-2">{parts}</li>;
        } else if (line.trim().startsWith('  - ')) {
          return <li key={index} className="ml-12 mb-1 list-disc">{parts}</li>;
        }
        
        return <p key={index} className="mb-2">{parts}</p>;
      }
      // Handle list items without bold
      else if (line.trim().startsWith('- ')) {
        return <li key={index} className="ml-6 mb-2">{line.trim().substring(2)}</li>;
      }
      else if (line.trim().startsWith('  - ')) {
        return <li key={index} className="ml-12 mb-1 list-disc">{line.trim().substring(4)}</li>;
      }
      // Handle empty lines
      else if (!line.trim()) {
        return <div key={index} className="h-4"></div>;
      }
      // Regular paragraph
      else {
        return <p key={index} className="mb-2">{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
          </Button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Badge variant="outline">Step 3 of 3</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {json && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full mx-auto">
            {/* Portfolio Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{json.portfolio_name}</h1>
              <div className="flex justify-center gap-4 mb-4">
                <Badge variant="outline" className="text-sm">{json.risk_level} risk</Badge>
                <Badge variant="outline" className="text-sm">${parseInt(json.investment_amount).toLocaleString()}</Badge>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300">{json.allocation}</p>
            </div>
            
            {/* Formatted Portfolio Content */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
              {json.response_json?.data?.response_json?.raw_text ? (
                <div className="text-gray-800 dark:text-gray-200">
                  {formatRawText(json.response_json.data.response_json.raw_text)}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No detailed portfolio data available</p>
              )}
            </div>
            
            {/* Raw JSON (Collapsed) */}
            <details className="mt-8">
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium mb-2">View Raw JSON Data</summary>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto text-xs text-gray-800 dark:text-gray-200 mt-2">
                {JSON.stringify(json, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        {!json && !loading && error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Error Loading Portfolio</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        )}
      </div>
    </div>
  )
}