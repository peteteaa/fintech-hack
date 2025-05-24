import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Connect to the FastAPI backend
    const response = await fetch('http://localhost:8000/api/portfolios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const portfolioData = await response.json();
    
    if (!portfolioData || !portfolioData.portfolios) {
      throw new Error('Invalid portfolio data received from backend');
    }
    
    console.log('Successfully fetched portfolio data from backend');
    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data from backend:', error);
    
    // If we reach here, the backend is not available
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data from backend' },
      { status: 503 }
    );
  }
}
