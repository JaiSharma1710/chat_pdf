import { Pinecone } from "@pinecone-database/pinecone";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

import { getAppwriteFileUrl } from "./uploadFIle";
import { getEmbeddings } from "./embeding";

let pineconeClient: Pinecone | null = null;

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

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
    // STEP-1 load the data from the url of the pdf
    const url = getAppwriteFileUrl(fileId);
    const response = await fetch(url);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = (await loader.load()) as PDFPage[];

    // STEP-2 split the data into small segments
    const document = await Promise.all(docs.map(prepareDocument));

    // STEP-3 vectorize and embed the docs
    const embedResult = embedDocument("hello my name is jai sharma");

    console.log(embedResult);

    return document;
  } catch (error) {
    console.log(error);
    return "";
  }
};

async function embedDocument(text: string) {
  getEmbeddings(text);
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
