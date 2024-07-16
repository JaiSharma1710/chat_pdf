import { loadPdfToPinecone } from "@/lib/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { downloadFileFromAppWrite } from "@/lib/downloadFile";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { fileName, fileId } = body;
    await loadPdfToPinecone(fileId);
    console.log(fileName, fileId);

    // downloadFileFromAppWrite("6696b5e70018f965044f");

    return NextResponse.json({ messages: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
