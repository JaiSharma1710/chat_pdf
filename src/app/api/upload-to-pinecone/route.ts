import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { getAppwriteFileUrl } from "@/lib/uploadFIle";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fileId, fileName } = body;
    const pdfURL = getAppwriteFileUrl(fileId);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: fileId,
        pdfUrl: pdfURL,
        pdfName: fileName,
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error at upload to pinecone: ${error.message}`);
    return NextResponse.json(
      { error: "something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
