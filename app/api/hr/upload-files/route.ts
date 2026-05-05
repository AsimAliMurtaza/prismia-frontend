import { NextResponse } from "next/server";

const BACKEND_ROUTE_UF =
  process.env.BACKEND_ROUTE_UF || "http://localhost:8000/hr/upload-files";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const forwardFormData = new FormData();
  forwardFormData.append("file", file); // must match FastAPI param name

  const backendRes = await fetch(BACKEND_ROUTE_UF, {
    method: "POST",
    body: forwardFormData, // no Content-Type header, fetch sets it automatically
  });

  const data = await backendRes.json();
  console.log("File upload response from backend:", data);
  return NextResponse.json(data);
}
