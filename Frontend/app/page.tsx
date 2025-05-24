"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, PieChart, Shield, Target, CheckCircle, ArrowRight, Users, Award } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    // Animate user count
    const timer = setInterval(() => {
      setUserCount((prev) => {
        if (prev < 12847) {
          return prev + Math.floor(Math.random() * 100) + 50
        }
        return 12847
      })
    }, 100)

    setTimeout(() => clearInterval(timer), 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">PortfolioAI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Link href="/invest">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="container mx-auto text-center max-w-4xl">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Badge variant="secondary" className="mb-6 animate-pulse">
              🚀 AI-Powered Portfolio Generation
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Build Your Perfect
              <span className="text-blue-600 dark:text-blue-400"> Investment Portfolio</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors">
              Get personalized investment recommendations based on your goals and risk tolerance. Start building wealth
              with confidence in just minutes.
            </p>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/invest">
                <Button size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform">
                  Create My Portfolio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform">
                Watch Demo
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur transition-colors">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userCount.toLocaleString()}+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Active Investors</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur transition-colors">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">$2.4B+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Assets Managed</div>
              </div>
              <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur transition-colors">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12.3%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Annual Return</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No financial advisor needed
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Personalized recommendations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Everything You Need to Invest Smarter
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
              Professional-grade portfolio management made simple
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
                Goal-Based Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Set your financial goals and get a customized investment strategy
              </p>
            </div>

            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
                Smart Risk Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Advanced algorithms protect your investments while maximizing growth
              </p>
            </div>

            <div className="text-center p-6 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
                Auto-Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                Your portfolio automatically rebalances to stay on track
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Trusted by 12,000+ investors</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">4.9/5 rating</span>
            </div>
          </div>
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 transition-colors">
            "PortfolioAI helped me create a diversified portfolio that's already outperforming my old investments. The
            AI recommendations are incredibly smart."
          </blockquote>
          <cite className="text-sm text-gray-500 dark:text-gray-400 mt-4 block transition-colors">
            — Sarah Chen, Software Engineer
          </cite>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white transition-colors">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Building Wealth?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who are already growing their wealth with AI
          </p>
          <Link href="/invest">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3 hover:scale-105 transition-transform">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-6 opacity-75">No credit card required • Free to start • Takes less than 5 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 transition-colors">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">PortfolioAI</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4 transition-colors">
            <p>&copy; 2024 PortfolioAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
