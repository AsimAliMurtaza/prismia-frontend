import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/agent/hr';

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log('Received request from frontend:', requestData);

    // Forward request to FastAPI backend
    const backendResponse = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: "327a7123-a9b4-430b-999d-1a914fab3b8a", message: requestData.message }),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Error from backend:', backendResponse.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get response from backend', details: errorText },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('Response from backend:', data);

    // Ensure we always return { result: string } structure
    return NextResponse.json(data , { status: 200 });

  } catch (error: any) {
    console.error('Error in Next.js API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
