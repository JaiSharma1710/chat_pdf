import { NextRequest, NextResponse } from "next/server";

import { loadPdfToPinecone } from "@/lib/pinecone";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { fileName, fileId } = body;

    console.log(fileId);

    const pages = await loadPdfToPinecone(fileId);

    console.log(pages);

    return NextResponse.json({ messages: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
