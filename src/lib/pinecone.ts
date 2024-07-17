import { Pinecone } from "@pinecone-database/pinecone";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

import { getAppwriteFileUrl } from "./uploadFIle";

let pineconeClient: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
};

export const loadPdfToPinecone = async (fileId: string) => {
  try {
    const url = getAppwriteFileUrl(fileId);
    const response = await fetch(url);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.log(error);
    return "";
  }
};
