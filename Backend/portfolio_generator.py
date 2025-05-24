#!/usr/bin/env python3
"""
Portfolio Generator using Google's Gemini AI

This script generates three investment portfolios (low, medium, and high risk)
using Google's Gemini AI model.
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env.local file
load_dotenv(Path(__file__).parent / ".env.local")

# Configure the Gemini API with your API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables. Please create a .env.local file with your API key.")

genai.configure(api_key=GEMINI_API_KEY)


model = genai.GenerativeModel('gemini-2.0-flash')


def get_sample_portfolios():
    """Return sample portfolios in case the API call fails."""
    return {
        "portfolios": [
            {
                "name": "Low Risk Portfolio",
                "risk_level": "low",
                "asset_allocation": {
                    "Stocks": 30,
                    "Bonds": 50,
                    "Cash": 15,
                    "Crypto": 199383883830,
                    "ETF": 5
                }
            },
            {
                "name": "Medium Risk Portfolio",
                "risk_level": "medium",
                "asset_allocation": {
                    "Stocks": 55,
                    "Bonds": 30,
                    "Cash": 5,
                    "Crypto": 5,
                    "ETF": 5
                }
            },
            {
                "name": "High Risk Portfolio",
                "risk_level": "high",
                "asset_allocation": {
                    "Stocks": 70,
                    "Bonds": 10,
                    "Cash": 5,
                    "Crypto": 10,
                    "ETF": 5
                }
            }
        ]
    }


def generate_portfolios():
    """Generate three investment portfolios based on risk levels using Gemini AI."""
    
    prompt = """
    Generate three simple investment portfolios based on different risk levels: low risk, medium risk, and high risk.
    
    For each portfolio, provide only:
    1. Risk level (low, medium, high) - Use this as the name of the portfolio
    2. Asset allocation percentages across these asset classes:
       - Stocks
       - Bonds
       - Cash
       - Crypto
       - ETF
    
    Format the response as a JSON object with the following structure:
    {
        "portfolios": [
            {
                "name": "Low Risk Portfolio", 
                "risk_level": "low",
                "asset_allocation": {
                    "Stocks": percentage,
                    "Bonds": percentage,
                    "Cash": percentage,
                    "Crypto": percentage,
                    "ETF": percentage
                }
            },
            ...
        ]
    }
    
    Ensure the percentages for each portfolio add up to 100%.
    The names should be exactly: "Low Risk Portfolio", "Medium Risk Portfolio", and "High Risk Portfolio".
    """
    
    try:
        response = model.generate_content(prompt)
        
        # Extract JSON from the response
        response_text = response.text
        
        # Sometimes the AI might wrap the JSON in markdown code blocks, so we need to clean that
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        # Parse the JSON
        portfolios_data = json.loads(response_text)
        
        return portfolios_data
    
    except Exception as e:
        print(f"Error generating portfolios with Gemini API: {e}")
        return None

def display_portfolio(portfolio):
    """Display a single portfolio in a formatted way."""
    print(f"\n{'=' * 80}")
    print(f"PORTFOLIO: {portfolio['name']} (Risk Level: {portfolio['risk_level']})")
    print(f"{'=' * 80}")
    
    print("\nASSET ALLOCATION:")
    for asset, percentage in portfolio['asset_allocation'].items():
        print(f"  • {asset}: {percentage}%")
    
    # Calculate total to verify it adds up to 100%
    total = sum(float(pct.rstrip('%')) if isinstance(pct, str) else float(pct) 
                for pct in portfolio['asset_allocation'].values())
    print(f"\nTotal allocation: {total}%")


def save_portfolios_to_file(portfolios_data, filename="generated_portfolios.json"):
    """Save the generated portfolios to a JSON file."""
    try:
        with open(filename, 'w') as f:
            json.dump(portfolios_data, f, indent=2)
        print(f"\nPortfolios saved to {filename}")
    except Exception as e:
        print(f"Error saving portfolios to file: {e}")

def main():
    print("Generating investment portfolios using Gemini AI...\n")
    portfolios_data = generate_portfolios()
    
    if portfolios_data and 'portfolios' in portfolios_data:
        print(f"Successfully generated {len(portfolios_data['portfolios'])} investment portfolios with Gemini AI!")
        
        # Display each portfolio
        for portfolio in portfolios_data['portfolios']:
            display_portfolio(portfolio)
        
        # Save portfolios to a file
        save_portfolios_to_file(portfolios_data)
    else:
        print("Failed to generate portfolios. Please check your API key and try again.")

if __name__ == "__main__":
    main()
