import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
};

export const uploadDataToPinecone = async (data: any, fileId: string) => {
  try {
    const client = await getPineconeClient();
    const pineconeIndex = client.index("chat-pdf");
    console.log("Inserting vectors into Pinecone");
    const nameSpace = convertToAscii(fileId);
    const response = await pineconeIndex.namespace(nameSpace).upsert(data);
    console.log(response);
  } catch (error) {
    console.log("error at upload to pinecone" + error);
  }
};
