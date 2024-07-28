import { convertToCoreMessages, generateText } from "ai";
import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";

export async function POST(req) {
  try {
    const { fileId, context, messages } = await req.json();

    if (!fileId) throw new Error("no file id found");
    if (!context) throw new Error("no context found");

    const { text } = await generateText({
      model: google("models/gemini-1.5-flash-latest"),
      system: `You are an helpful ai assistant your name is chatPDF.ai that can answer any question using the context below
      START OF THE CONTEXT
      ${context}
      END TO CONTEXT
      if you don't know the answer just say i don't know don't make up the answer
      `,
      messages: convertToCoreMessages(messages),
    });

    return NextResponse.json(
      {
        message: text,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "something went wrong",
      },
      { status: 500 }
    );
  }
}
