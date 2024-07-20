import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { loadPdfData } from "@/lib/loadPdfData";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { fileId } = body;
    const data = await loadPdfData(fileId);
    return NextResponse.json({ messages: "success", data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
