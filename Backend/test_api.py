#!/usr/bin/env python3
"""
Test script for directly calling the external API
"""

import json
import requests
import subprocess
import sys
import urllib3

# Suppress SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def test_api_with_requests(investment_amount, allocation, portfolio_name=None, risk_level=None):
    """Test the API using the requests library with user-provided values
    
    Args:
        investment_amount: User's investment amount from portfolio/invest (required)
        allocation: JSON of user's selected portfolio allocation (required)
        portfolio_name: Name of the selected portfolio (optional)
        risk_level: Risk level of the selected portfolio (optional)
    """
    print("\n==== TOOLHOUSE API CALL DEBUG ====\n")
    print("Method: requests library")
    print(f"Investment Amount (var1): {investment_amount}")
    print(f"Allocation (var2): {allocation}")
    
    # Create payload with user-provided values
    payload = {
        "vars": {
            "var1": investment_amount,
            "var2": allocation
        }
    }
    
    # Add optional portfolio details if provided
    if portfolio_name:
        print(f"Portfolio Name: {portfolio_name}")
        payload["vars"]["portfolio_name"] = portfolio_name
        
    if risk_level:
        print(f"Risk Level: {risk_level}")
        payload["vars"]["risk_level"] = risk_level
    
    print(f"\nFull payload: {json.dumps(payload, indent=2)}")
    print(f"API URL: https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb")
    print("\n==== BEGIN API CALL ====\n")
    
    try:
        # Try with SSL verification disabled
        response = requests.post(
            "https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb",
            json=payload,
            headers={"Content-Type": "application/json"},
            verify=False
        )
        
        print(f"Status code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response body: {response.text}")
        
        print("\n==== TOOLHOUSE API CALL COMPLETED SUCCESSFULLY ====\n")
        
        # Try to parse the response as JSON
        try:
            response_json = response.json()
            return True, response_json
        except json.JSONDecodeError:
            # If it's not valid JSON, return the text
            return True, {"raw_text": response.text}
    except Exception as e:
        print(f"\n==== TOOLHOUSE API CALL FAILED ====\n")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print(f"Error details: {str(e)}")
        return False, {"error": str(e)}

def test_api_with_curl(investment_amount, allocation, portfolio_name=None, risk_level=None):
    """Test the API using curl command with user-provided values
    
    Args:
        investment_amount: User's investment amount from portfolio/invest (required)
        allocation: JSON of user's selected portfolio allocation (required)
        portfolio_name: Name of the selected portfolio (optional)
        risk_level: Risk level of the selected portfolio (optional)
    """
    print("\n==== TOOLHOUSE API CALL DEBUG (CURL) ====\n")
    print("Method: curl command")
    print(f"Investment Amount (var1): {investment_amount}")
    print(f"Allocation (var2): {allocation}")
    
    # Create payload with user-provided values
    payload = {
        "vars": {
            "var1": investment_amount,
            "var2": allocation
        }
    }
    
    # Add optional portfolio details if provided
    if portfolio_name:
        print(f"Portfolio Name: {portfolio_name}")
        payload["vars"]["portfolio_name"] = portfolio_name
        
    if risk_level:
        print(f"Risk Level: {risk_level}")
        payload["vars"]["risk_level"] = risk_level
    
    print(f"\nFull payload: {json.dumps(payload, indent=2)}")
    print(f"API URL: https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb")
    
    # Create a verbose curl command for debugging
    curl_command = [
        "curl", 
        "-k",  # Skip SSL verification
        "-v",  # Verbose output
        "https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(payload)
    ]
    
    # Print the exact curl command for manual testing
    curl_string = f"curl -k -v 'https://agents.toolhouse.ai/aee55964-7c4e-4dad-80cf-568513e356bb' \
-H 'Content-Type: application/json' \
-d '{json.dumps(payload)}'"
    
    print("\nCurl command for manual testing:")
    print(curl_string)
    print("\n==== BEGIN CURL API CALL ====\n")
    
    try:
        result = subprocess.run(curl_command, capture_output=True, text=True)
        print(f"Exit code: {result.returncode}")
        print(f"Stdout: {result.stdout}")
        
        if result.stderr:
            print(f"Stderr (connection details): {result.stderr}")
        
        if result.returncode == 0:
            print("\n==== TOOLHOUSE API CURL CALL COMPLETED SUCCESSFULLY ====\n")
            # Try to parse the response as JSON
            try:
                response_json = json.loads(result.stdout)
                return True, response_json
            except json.JSONDecodeError:
                # If it's not valid JSON, return the text
                return True, {"raw_text": result.stdout}
        else:
            print("\n==== TOOLHOUSE API CURL CALL FAILED ====\n")
            return False, {"error": result.stderr}
    except Exception as e:
        print(f"\n==== TOOLHOUSE API CURL CALL FAILED ====\n")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print(f"Error details: {str(e)}")
        return False, {"error": str(e)}

if __name__ == "__main__":
    print("=== API Testing Script ===")
    
    # Get command line arguments if provided
    import argparse
    parser = argparse.ArgumentParser(description='Test the Toolhouse API with user-provided values')
    parser.add_argument('--amount', type=str, help='Investment amount from user')
    parser.add_argument('--allocation', type=str, help='JSON of user\'s portfolio allocation')
    parser.add_argument('--portfolio', type=str, help='Name of the selected portfolio')
    parser.add_argument('--risk', type=str, help='Risk level of the selected portfolio')
    args = parser.parse_args()
    
    # Use command line arguments if provided, otherwise use defaults
    investment_amount = args.amount if args.amount else "2000"
    allocation = args.allocation if args.allocation else "30% Stocks, 50% Bonds, 15% Cash, 5% ETF"
    portfolio_name = args.portfolio if args.portfolio else "Sample Portfolio"
    risk_level = args.risk if args.risk else "medium"
    
    print(f"Using investment amount: {investment_amount}")
    print(f"Using allocation: {allocation}")
    print(f"Using portfolio name: {portfolio_name}")
    print(f"Using risk level: {risk_level}")
    
    requests_success = test_api_with_requests(investment_amount, allocation, portfolio_name, risk_level)
    curl_success = test_api_with_curl(investment_amount, allocation, portfolio_name, risk_level)
    
    if requests_success or curl_success:
        print("\nAt least one method succeeded!")
        sys.exit(0)
    else:
        print("\nBoth methods failed. Please check your network connection and SSL configuration.")
        sys.exit(1)
