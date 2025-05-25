from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from portfolio_generator import generate_portfolios
import uvicorn
import json
import requests
import os
import uuid
from typing import Dict, Any, Optional, List
from test_api import test_api_with_requests, test_api_with_curl
from datetime import datetime

# Define models for the API
class UserPortfolio(BaseModel):
    investment_amount: str
    allocation: str

class PortfolioResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    
class ToolhouseData(BaseModel):
    portfolio_name: str
    risk_level: str
    investment_amount: str
    allocation: str
    response_json: Dict[str, Any]
    
class StoredPortfolio(BaseModel):
    portfolio_id: str
    portfolio_data: ToolhouseData

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

# Define the portfolio request model for the API
class PortfolioRequest(BaseModel):
    investment_amount: str
    allocation: str
    portfolio_name: str
    risk_level: str

# In-memory storage for portfolios
stored_portfolios = {}

# Function to save portfolio data to a file
def save_portfolio_to_file(portfolio_id, portfolio_data):
    try:
        # Create a portfolios directory if it doesn't exist
        os.makedirs('portfolios', exist_ok=True)
        
        # Save the portfolio data to a JSON file
        file_path = f'portfolios/{portfolio_id}.json'
        with open(file_path, 'w') as f:
            json.dump(portfolio_data, f, indent=2)
            
        print(f"Portfolio saved to {file_path}")
        return True
    except Exception as e:
        print(f"Error saving portfolio to file: {e}")
        return False

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

@app.post("/api/test-api")
async def test_api(portfolio_request: PortfolioRequest):
    """Test the Toolhouse API with the provided portfolio data"""
    try:
        # Extract values from the request
        investment_amount = portfolio_request.investment_amount
        allocation = portfolio_request.allocation
        portfolio_name = portfolio_request.portfolio_name
        risk_level = portfolio_request.risk_level
        
        print(f"\n==== TOOLHOUSE API CALL FROM BACKEND ====\n")
        print(f"Investment Amount: {investment_amount}")
        print(f"Allocation: {allocation}")
        print(f"Portfolio Name: {portfolio_name}")
        print(f"Risk Level: {risk_level}")
        
        # Try with requests first - pass all user data
        requests_success, response_data = test_api_with_requests(
            investment_amount=investment_amount, 
            allocation=allocation,
            portfolio_name=portfolio_name,
            risk_level=risk_level
        )
        
        if requests_success:
            # Save to public/latest.json using absolute path
            try:
                frontend_public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Frontend', 'public')
                os.makedirs(frontend_public_dir, exist_ok=True)
                latest_json_path = os.path.join(frontend_public_dir, 'latest.json')
                
                portfolio_data = {
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level,
                    "investment_amount": investment_amount,
                    "allocation": allocation,
                    "response_json": response_data
                }
                
                with open(latest_json_path, 'w') as f:
                    json.dump(portfolio_data, f, indent=2)
                    
                print(f"Successfully saved test_api data to {latest_json_path}")
            except Exception as e:
                print(f"Error saving to latest.json: {e}")
            return PortfolioResponse(
                success=True,
                message="API call successful using requests library",
                data={
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level,
                    "investment_amount": investment_amount,
                    "allocation": allocation,
                    "response_json": response_data  # Include the actual API response
                }
            )
        
        # If requests failed, try with curl - pass all user data
        curl_success, curl_response_data = test_api_with_curl(
            investment_amount=investment_amount, 
            allocation=allocation,
            portfolio_name=portfolio_name,
            risk_level=risk_level
        )
        
        if curl_success:
            # Save to public/latest.json using absolute path
            try:
                frontend_public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Frontend', 'public')
                os.makedirs(frontend_public_dir, exist_ok=True)
                latest_json_path = os.path.join(frontend_public_dir, 'latest.json')
                
                portfolio_data = {
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level,
                    "investment_amount": investment_amount,
                    "allocation": allocation,
                    "response_json": curl_response_data
                }
                
                with open(latest_json_path, 'w') as f:
                    json.dump(portfolio_data, f, indent=2)
                    
                print(f"Successfully saved test_api curl data to {latest_json_path}")
            except Exception as e:
                print(f"Error saving to latest.json: {e}")
            return PortfolioResponse(
                success=True,
                message="API call successful using curl command",
                data={
                    "portfolio_name": portfolio_name,
                    "risk_level": risk_level,
                    "investment_amount": investment_amount,
                    "allocation": allocation,
                    "response_json": curl_response_data  # Include the actual API response
                }
            )
        
        # If both methods failed, return an error
        return PortfolioResponse(
            success=False,
            message="Failed to call Toolhouse API with both methods",
            data=None
        )
    except Exception as e:
        print(f"Error in test_api endpoint: {e}")
        return PortfolioResponse(
            success=False,
            message=f"Error: {str(e)}",
            data=None
        )


@app.post("/api/generate-portfolio")
async def generate_portfolio(portfolio_request: PortfolioRequest):
    """Generate a portfolio based on user selections and store it in the backend"""
    try:
        # Extract values from the request
        investment_amount = portfolio_request.investment_amount
        portfolio_name = portfolio_request.portfolio_name
        risk_level = portfolio_request.risk_level
        
        # Determine allocation based on portfolio type and risk level
        allocation = ""
        if portfolio_name == "High Risk Portfolio":
            allocation = "70% Stocks, 10% Bonds, 15% Cryptocurrency, 5% ETFs"
        elif portfolio_name == "Moderate Risk Portfolio":
            allocation = "60% Stocks, 20% Bonds, 10% Cryptocurrency, 10% ETFs"
        elif portfolio_name == "Low Risk Portfolio":
            allocation = "40% Stocks, 40% Bonds, 5% Cryptocurrency, 15% ETFs"
        else:
            # Custom portfolio or fallback
            allocation = "50% Stocks, 30% Bonds, 10% Cryptocurrency, 10% ETFs"
        
        print(f"\n==== GENERATING PORTFOLIO FROM USER SELECTIONS ====\n")
        print(f"Portfolio Name: {portfolio_name}")
        print(f"Risk Level: {risk_level}")
        print(f"Investment Amount: {investment_amount}")
        print(f"Allocation: {allocation}")
        
        # Call the Toolhouse API using the test_api_with_requests function
        api_success, api_response = test_api_with_requests(
            investment_amount=investment_amount,
            allocation=allocation,
            portfolio_name=portfolio_name,
            risk_level=risk_level
        )
        
        if not api_success:
            # Try with curl as fallback
            api_success, api_response = test_api_with_curl(
                investment_amount=investment_amount,
                allocation=allocation,
                portfolio_name=portfolio_name,
                risk_level=risk_level
            )
            
            if not api_success:
                return PortfolioResponse(
                    success=False,
                    message="Failed to generate portfolio with Toolhouse API",
                    data=None
                )
        
        # Prepare portfolio data for storage
        portfolio_data = {
            "portfolio_name": portfolio_name,
            "risk_level": risk_level,
            "investment_amount": investment_amount,
            "allocation": allocation,
            "response_json": api_response
        }
        
        # Store the portfolio data
        portfolio_id = str(uuid.uuid4())
        stored_portfolios[portfolio_id] = StoredPortfolio(
            portfolio_id=portfolio_id,
            portfolio_data=ToolhouseData(**portfolio_data)
        )
        
        # Also save to file for persistence
        save_portfolio_to_file(portfolio_id, portfolio_data)
        # Also save as latest.json for frontend using absolute path
        try:
            frontend_public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Frontend', 'public')
            os.makedirs(frontend_public_dir, exist_ok=True)
            latest_json_path = os.path.join(frontend_public_dir, 'latest.json')
            
            with open(latest_json_path, 'w') as f:
                json.dump(portfolio_data, f, indent=2)
                
            print(f"Successfully saved generate_portfolio data to {latest_json_path}")
        except Exception as e:
            print(f"Error saving to latest.json: {e}")
        
        return PortfolioResponse(
            success=True,
            message="Portfolio generated and stored successfully",
            data={
                "portfolio_id": portfolio_id,
                "portfolio_name": portfolio_name,
                "risk_level": risk_level,
                "investment_amount": investment_amount,
                "allocation": allocation,
                "response_json": api_response
            }
        )
    except Exception as e:
        print(f"Error generating portfolio: {e}")
        return PortfolioResponse(
            success=False,
            message=f"Error running test API: {str(e)}"
        )

# In-memory storage for portfolios (in a real app, use a database)
# Structure: {portfolio_id: StoredPortfolio}
# This is already defined above: stored_portfolios = {}

# Ensure data directory exists
DATA_DIR = "./data"
os.makedirs(DATA_DIR, exist_ok=True)

@app.post("/api/portfolios/store")
async def store_portfolio(data: ToolhouseData):
    try:
        # Generate a unique ID
        portfolio_id = f"portfolio_{datetime.now().strftime('%Y%m%d%H%M%S')}_{len(stored_portfolios)}"
        
        # Create a stored portfolio object
        stored_portfolio = StoredPortfolio(
            portfolio_id=portfolio_id,
            portfolio_data=data
        )
        
        # Store in memory
        stored_portfolios[portfolio_id] = stored_portfolio
        
        # Also save to a JSON file for persistence
        with open(f"{DATA_DIR}/{portfolio_id}.json", "w") as f:
            json.dump(stored_portfolio.dict(), f, indent=2)
        # Also save to Frontend/public/latest.json using absolute path
        try:
            frontend_public_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'Frontend', 'public')
            os.makedirs(frontend_public_dir, exist_ok=True)
            latest_json_path = os.path.join(frontend_public_dir, 'latest.json')
            
            with open(latest_json_path, 'w') as f_latest:
                json.dump(stored_portfolio.portfolio_data.dict(), f_latest, indent=2)
                
            print(f"Successfully saved store_portfolio data to {latest_json_path}")
        except Exception as e:
            print(f"Error saving to latest.json: {e}")
        
        return {"success": True, "portfolio_id": portfolio_id}
    except Exception as e:
        print(f"Error storing portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to store portfolio: {str(e)}")

@app.get("/api/portfolios/{portfolio_id}")
async def get_portfolio(portfolio_id: str):
    # Try to get from memory first
    if portfolio_id in stored_portfolios:
        return stored_portfolios[portfolio_id]
    
    # Try to get from portfolios directory (from generate-portfolio endpoint)
    try:
        file_path = f"portfolios/{portfolio_id}.json"
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                data = json.load(f)
                # Create a StoredPortfolio object
                portfolio_data = ToolhouseData(**data)
                stored_portfolio = StoredPortfolio(
                    portfolio_id=portfolio_id,
                    portfolio_data=portfolio_data
                )
                # Store in memory for future requests
                stored_portfolios[portfolio_id] = stored_portfolio
                return stored_portfolio
    except Exception as e:
        print(f"Error loading from portfolios directory: {e}")
    
    # If not found in portfolios directory, try the DATA_DIR
    try:
        file_path = f"{DATA_DIR}/{portfolio_id}.json"
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                data = json.load(f)
                # Store in memory for future requests
                stored_portfolios[portfolio_id] = StoredPortfolio(**data)
                return data
        else:
            raise HTTPException(status_code=404, detail=f"Portfolio with ID {portfolio_id} not found")
    except Exception as e:
        print(f"Error retrieving portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve portfolio: {str(e)}")

@app.get("/api/portfolios/latest")
async def get_latest_portfolio():
    """Get the most recently created portfolio"""
    try:
        # Check stored_portfolios first
        if stored_portfolios:
            # Find the most recent portfolio based on ID (which contains timestamp)
            latest_portfolio_id = sorted(stored_portfolios.keys(), reverse=True)[0]
            return stored_portfolios[latest_portfolio_id]
        
        # If no portfolios in memory, check the portfolios directory
        if os.path.exists('portfolios'):
            portfolio_files = [f for f in os.listdir('portfolios') if f.endswith('.json')]
            if portfolio_files:
                # Sort by modification time (most recent first)
                latest_file = sorted(portfolio_files, key=lambda x: os.path.getmtime(os.path.join('portfolios', x)), reverse=True)[0]
                portfolio_id = latest_file.replace('.json', '')
                
                with open(os.path.join('portfolios', latest_file), 'r') as f:
                    data = json.load(f)
                    # Create a StoredPortfolio object
                    portfolio_data = ToolhouseData(**data)
                    stored_portfolio = StoredPortfolio(
                        portfolio_id=portfolio_id,
                        portfolio_data=portfolio_data
                    )
                    # Store in memory for future requests
                    stored_portfolios[portfolio_id] = stored_portfolio
                    return stored_portfolio
        
        # If no portfolios in the portfolios directory, check the DATA_DIR
        if os.path.exists(DATA_DIR):
            portfolio_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
            if portfolio_files:
                # Sort by modification time (most recent first)
                latest_file = sorted(portfolio_files, key=lambda x: os.path.getmtime(os.path.join(DATA_DIR, x)), reverse=True)[0]
                
                with open(os.path.join(DATA_DIR, latest_file), 'r') as f:
                    data = json.load(f)
                    return data
        
        # No portfolios found
        raise HTTPException(status_code=404, detail="No portfolios found")
    except Exception as e:
        print(f"Error getting latest portfolio: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get latest portfolio: {str(e)}")

@app.get("/api/portfolios/list")
async def list_portfolios():
    # List all portfolios (both in memory and from files)
    portfolios = []
    
    # Add in-memory portfolios
    for portfolio_id, portfolio in stored_portfolios.items():
        portfolios.append({
            "id": portfolio_id,
            "portfolio_name": portfolio.portfolio_data.portfolio_name,
            "risk_level": portfolio.portfolio_data.risk_level,
            "investment_amount": portfolio.portfolio_data.investment_amount
        })
    
    # Add portfolios from files that aren't in memory
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".json"):
                portfolio_id = filename.replace(".json", "")
                if portfolio_id not in stored_portfolios:
                    try:
                        with open(f"{DATA_DIR}/{filename}", "r") as f:
                            data = json.load(f)
                            portfolios.append({
                                "id": data["id"],
                                "created_at": data["created_at"],
                                "portfolio_name": data["portfolio_data"]["portfolio_name"],
                                "risk_level": data["portfolio_data"]["risk_level"],
                                "investment_amount": data["portfolio_data"]["investment_amount"]
                            })
                    except Exception as e:
                        print(f"Error reading portfolio file {filename}: {e}")
    
    # Sort by creation date (newest first)
    portfolios.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {"portfolios": portfolios}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
