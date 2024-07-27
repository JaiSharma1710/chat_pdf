import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";

// let pineconeClient: Pinecone | null = null;

// export const getPineconeClient = async () => {
//   if (!pineconeClient) {
//     pineconeClient = new Pinecone({
//       apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
//     });
//   }
//   return pineconeClient;
// };

export const uploadDataToPinecone = async (data: any, fileId: string) => {
  try {
    const client = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
    const pineconeIndex = client.index("chat-pdf");
    const nameSpace = convertToAscii(fileId);
    await pineconeIndex.namespace(nameSpace).upsert(data);
    return nameSpace;
  } catch (error) {
    console.log("error at upload to pinecone" + error);
  }
};

export async function getMatchesFromEmbeddings(
  embeddings: any,
  fileId: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
    const pineconeIndex = client.index("chat-pdf");
    const nameSpace = convertToAscii(fileId);
    const queryResponse = await pineconeIndex.namespace(nameSpace).query({
      vector: embeddings,
      topK: 5,
      includeMetadata: true,
    });
    return queryResponse.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}
