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

def test_api_with_requests(investment_amount="2000", allocation="20% ETF, 40% crypto, 40% stock"):
    """Test the API using the requests library"""
    print("\n==== TOOLHOUSE API CALL DEBUG ====\n")
    print("Method: requests library")
    print(f"Investment Amount (var1): {investment_amount}")
    print(f"Allocation (var2): {allocation}")
    
    payload = {
        "vars": {
            "var1": investment_amount,
            "var2": allocation
        }
    }
    
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
        return True
    except Exception as e:
        print(f"\n==== TOOLHOUSE API CALL FAILED ====\n")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print(f"Error details: {str(e)}")
        return False

def test_api_with_curl(investment_amount="2000", allocation="20% ETF, 40% crypto, 40% stock"):
    """Test the API using curl command"""
    print("\n==== TOOLHOUSE API CALL DEBUG (CURL) ====\n")
    print("Method: curl command")
    print(f"Investment Amount (var1): {investment_amount}")
    print(f"Allocation (var2): {allocation}")
    
    payload = {
        "vars": {
            "var1": investment_amount,
            "var2": allocation
        }
    }
    
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
            return True
        else:
            print("\n==== TOOLHOUSE API CURL CALL FAILED ====\n")
            return False
    except Exception as e:
        print(f"\n==== TOOLHOUSE API CURL CALL FAILED ====\n")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        print(f"Error details: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== API Testing Script ===")
    
    requests_success = test_api_with_requests()
    curl_success = test_api_with_curl()
    
    if requests_success or curl_success:
        print("\nAt least one method succeeded!")
        sys.exit(0)
    else:
        print("\nBoth methods failed. Please check your network connection and SSL configuration.")
        sys.exit(1)
