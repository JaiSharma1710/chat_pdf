import md5 from "md5";
import { HfInference } from "@huggingface/inference";
import { Document } from "@pinecone-database/doc-splitter";

export async function getEmbeddings(text: string) {
  const inference = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API!);
  const input = text.replace(/\n/g, " ");
  const result = await inference.featureExtraction({
    model: "intfloat/multilingual-e5-large",
    inputs: input,
  });
  return result;
}

export async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log("Error at embedDocument: " + error);
    throw error;
  }
}
