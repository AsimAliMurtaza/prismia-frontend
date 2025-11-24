import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = 'http://127.0.0.1:8000/agent'; // Your FastAPI backend URL

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
      body: JSON.stringify(requestData),
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
    return NextResponse.json({ data: { response: data.response } }, { status: 200 });

  } catch (error: any) {
    console.error('Error in Next.js API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
