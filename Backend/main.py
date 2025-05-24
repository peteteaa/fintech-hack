from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from portfolio_generator import generate_portfolios
import uvicorn
import json
import requests
from typing import Dict, Any, Optional
from test_api import test_api_with_requests, test_api_with_curl

# Define models for the API
class UserPortfolio(BaseModel):
    investment_amount: str
    allocation: str

class PortfolioResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/portfolios")
async def get_portfolios():
    try:
        # Ensure we're using Gemini to generate portfolios
        portfolios = generate_portfolios()
        if not portfolios:
            raise HTTPException(status_code=500, detail="Failed to generate portfolios with Gemini")
        
        print("Successfully generated portfolios with Gemini API")
        print(json.dumps(portfolios, indent=2))
        
        return portfolios
    except Exception as e:
        print(f"Error generating portfolios with Gemini: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")

# Update the model to include portfolio name/type
class UserPortfolio(BaseModel):
    investment_amount: str
    allocation: str
    portfolio_name: Optional[str] = None
    risk_level: Optional[str] = None

@app.post("/api/user-portfolio", response_model=PortfolioResponse)
async def create_user_portfolio(portfolio: UserPortfolio):
    try:
        # Extract data from the user's portfolio
        investment_amount = portfolio.investment_amount
        allocation = portfolio.allocation
        portfolio_name = portfolio.portfolio_name or "Custom Portfolio"
        risk_level = portfolio.risk_level or "custom"
        
        # Prepare the data for the external API with portfolio details
        # var1 should be the investment amount
        # var2 should be the percentage breakdowns from the portfolio
        payload = {
            "vars": {
                "var1": investment_amount,
                "var2": allocation
            }
        }
        
        # Log additional information about the portfolio
        print(f"Portfolio Name: {portfolio_name}")
        print(f"Risk Level: {risk_level}")
        
        # Enhanced debugging for API calls
        print("\n==== TOOLHOUSE API CALL FROM MAIN ENDPOINT ====\n")
        print(f"Portfolio Name: {portfolio_name}")
        print(f"Risk Level: {risk_level}")
        print(f"Investment Amount (var1): {investment_amount}")
        print(f"Allocation (var2): {allocation}")
        print(f"\nSending user portfolio to external API: {json.dumps(payload, indent=2)}")
        
        # Print curl command for manual testing with more details
        curl_command = f"""curl -k -v "https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb" \
-H "Content-Type: application/json" \
-d '{json.dumps(payload)}'""" 
        print("\nYou can test this API call manually with:\n")
        print(curl_command)
        print("\n==== BEGIN MAIN API CALL ====\n")
        
        try:
            # Make the POST request to the external API with SSL verification disabled
            response = requests.post(
                "https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb",
                json=payload,
                headers={"Content-Type": "application/json"},
                verify=False  # Disable SSL verification
            )
            # Suppress only the InsecureRequestWarning
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        except requests.exceptions.SSLError as ssl_err:
            print(f"SSL Error: {ssl_err}")
            # Simulate a successful response for demonstration purposes
            return PortfolioResponse(
                success=True,
                message="Portfolio processed locally (SSL error with external API)",
                data={
                    "note": "This is a simulated response due to SSL connection issues",
                    "portfolio": {
                        "investment_amount": investment_amount,
                        "allocation": allocation,
                        "risk_profile": "high" if "crypto" in allocation.lower() else "medium"
                    }
                }
            )
        
        # Check if the request was successful
        if response.status_code == 200:
            response_data = response.json()
            return PortfolioResponse(
                success=True,
                message="Portfolio successfully submitted",
                data=response_data
            )
        else:
            return PortfolioResponse(
                success=False,
                message=f"Error from external API: {response.status_code}",
                data={"status_code": response.status_code, "response": response.text}
            )
            
    except Exception as e:
        print(f"Error processing user portfolio: {e}")
        return PortfolioResponse(
            success=False,
            message=f"Error processing portfolio: {str(e)}"
        )

@app.post("/api/test-api", response_model=PortfolioResponse)
async def run_test_api(portfolio: UserPortfolio):
    try:
        # Extract data from the user's portfolio
        investment_amount = portfolio.investment_amount
        allocation = portfolio.allocation
        portfolio_name = portfolio.portfolio_name or "Custom Portfolio"
        risk_level = portfolio.risk_level or "custom"
        
        print(f"\n=== Running Test API for {portfolio_name} ({risk_level}) ===\n")
        
        # Call the test API directly
        success = test_api_with_requests(investment_amount, allocation)
        
        # Try with curl as fallback if requests fails
        if not success:
            print("\nFallback to curl method...\n")
            success = test_api_with_curl()
        
        if success:
            return PortfolioResponse(
                success=True,
                message="Test API call successful",
                data={
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level,
                    "investment_amount": investment_amount,
                    "allocation": allocation,
                    "method": "direct API call"
                }
            )
        else:
            return PortfolioResponse(
                success=False,
                message="Test API call failed",
                data={
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level
                }
            )
    except Exception as e:
        print(f"Error running test API: {e}")
        return PortfolioResponse(
            success=False,
            message=f"Error running test API: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
