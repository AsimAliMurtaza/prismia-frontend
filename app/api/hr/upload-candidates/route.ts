import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const forwardFormData = new FormData();
  forwardFormData.append("file", file); // must match FastAPI param name

  const backendRes = await fetch("http://localhost:8000/hr/upload-candidates", {
    method: "POST",
    body: forwardFormData, // no Content-Type header, fetch sets it automatically
  });

  const data = await backendRes.json();
  return NextResponse.json(data);
}
