# Investment Portfolio Generator

This tool uses Google's Gemini AI to generate three investment portfolios based on different risk levels (low, medium, and high).

## Features

- Generates three detailed investment portfolios with different risk profiles
- Provides asset allocation percentages
- Recommends specific investments (ETFs, index funds, etc.)
- Includes expected returns, volatility assessment, and investment horizon
- Saves the generated portfolios to a JSON file for further analysis

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env.local` file with your Gemini API key:
   ```
   cp .env.local.example .env.local
   ```
4. Edit the `.env.local` file and replace `your_gemini_api_key_here` with your actual Gemini API key

## Usage

Run the script:

```bash
python portfolio_generator.py
```

The script will:
1. Connect to the Gemini API
2. Generate three investment portfolios (low, medium, and high risk)
3. Display the portfolios in the terminal
4. Save the portfolios to a file named `generated_portfolios.json`

## Example Output

The generated portfolios include:
- Portfolio name
- Risk level
- Asset allocation across different asset classes
- Specific investment recommendations with tickers
- Expected annual return range
- Volatility assessment
- Recommended investment horizon
- Brief investment strategy explanation

## Note

This tool is for educational purposes only. The generated portfolios are not financial advice. Always consult with a financial advisor before making investment decisions.
