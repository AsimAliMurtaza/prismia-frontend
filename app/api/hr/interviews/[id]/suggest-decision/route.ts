import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"
    const res = await fetch(`${BACKEND_URL}/interviews/${params.id}/suggest-decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("POST suggest-decision error:", error)
    return NextResponse.json({ error: "Failed to get suggestion" }, { status: 500 })
  }
}