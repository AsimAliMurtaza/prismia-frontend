import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, email, bio, image } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        name,
        email,
        bio,
        image,
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}