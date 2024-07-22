import { getContext } from "@/lib/context";
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, Message, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import { NextResponse } from "next/server";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API);

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, fileId } = await req.json();

  const lastMessage: Message = messages[messages.length - 1];

  const context = await getContext(lastMessage.content, fileId);

  const prompt = {
    role: "system",
    content: `You are an helpful ai assistant that can answer any question from the given context asked by the human 
    START OF THE CONTEXT
    ${context} 
    END TO CONTEXT
    if you don't know the answer just say i don't know don't make up the answer
    `,
  };

  const messageChain = [
    prompt,
    ...messages.filter((msg: Message) => msg.role !== "system"),
  ];

  console.log(messageChain);

  const response = await Hf.chatCompletion({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: messageChain,
    max_tokens: 500,
    temperature: 0.1,
    seed: 0,
  });

  const assistantResponse = response.choices[0].message;
  messageChain.push(assistantResponse);
  return NextResponse.json(messageChain);
}
