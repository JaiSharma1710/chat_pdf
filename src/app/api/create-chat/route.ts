import { messages } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { fileName, fileId } = body;

    console.log(fileName, fileId);

    return NextResponse.json({ messages: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
