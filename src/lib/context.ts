import { getEmbeddings } from "./embeding";
import { getPineconeClient } from "./pinecone";
import { convertToAscii } from "./utils";

export async function getMatchesFromEmbeddings(
  embeddings: any,
  fileId: string
) {
  const client = await getPineconeClient();
  const pineconeIndex = client.index("chat-pdf");

  try {
    const nameSpace = convertToAscii(fileId);

    const queryResponse = await pineconeIndex.namespace(nameSpace).query({
      vector: embeddings,
      topK: 5,
      includeMetadata: true,
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.log("error quering embeddings", error);
    throw error;
  }
}

export async function getContext(query: string, fileId: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileId);
  const qualifingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifingDocs.map((match) => (match.metadata as Metadata).text);

  return docs.join("\n").substring(0, 3000);
}
