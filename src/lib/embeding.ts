import md5 from "md5";
import axios from "axios";
import { Document } from "@pinecone-database/doc-splitter";

const API_URL =
  "https://api-inference.huggingface.co/pipeline/feature-extraction/intfloat/multilingual-e5-large";

export async function getEmbeddings(text: string) {
  try {
    console.log("converting to embeddings");
    const input = text.replace(/\n/g, " ");
    const response = await axios.post(
      API_URL,
      { inputs: input },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
    throw error;
  }
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
