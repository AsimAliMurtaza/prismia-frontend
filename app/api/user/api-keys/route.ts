import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import UserAPIKey from "@/models/UserAPIKey";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import crypto from "crypto";

// =========================================================
// ENCRYPTION
// =========================================================

const algorithm = "aes-256-cbc";

const secret = process.env.MASTER_ENCRYPTION_KEY!;

const key = crypto.createHash("sha256").update(secret).digest();

function encrypt(text: string) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

function maskKey(key: string) {
  return key.slice(0, 6) + "********";
}

// =========================================================
// GET
// =========================================================

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user?.email;

  const keys = await UserAPIKey.find({ user_email: userEmail });

  return NextResponse.json({
    keys: keys.map((k) => ({
      _id: k._id,
      provider: k.provider,
      api_key_masked: maskKey(k.api_key_preview),
      created_at: k.created_at,
      status: "active",
    })),
  });
}

// =========================================================
// POST
// =========================================================

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user?.email;
    const body = await req.json();

    const { provider, api_key } = body;

    if (!provider || !api_key) {
      return NextResponse.json(
        {
          message: "Missing fields",
        },
        { status: 400 },
      );
    }

    const encrypted = encrypt(api_key);

    await UserAPIKey.findOneAndUpdate(
      {
        provider,
        user_email: userEmail,
      },
      {
        provider,
        encrypted_api_key: encrypted,
        api_key_preview: maskKey(api_key),
        created_at: new Date(),
        user_email: userEmail,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// =========================================================
// DELETE
// =========================================================

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const provider = req.nextUrl.searchParams.get("provider");

    await UserAPIKey.findOneAndDelete({
      provider,
      user_email: session.user?.email,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
