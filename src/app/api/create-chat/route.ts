import { NextRequest, NextResponse } from "next/server";

import { loadPdfToPinecone } from "@/lib/pinecone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileId } = body;
    const data = await loadPdfToPinecone(fileId);
    return NextResponse.json({ messages: "success", data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
