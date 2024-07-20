import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

import { getAppwriteFileUrl } from "./uploadFIle";

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export const loadPdfData = async (fileId: string) => {
  try {
    // STEP-1 load the data from the url of the pdf
    const url = getAppwriteFileUrl(fileId);
    const response = await fetch(url);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = (await loader.load()) as PDFPage[];

    // STEP-2 split the data into small segments
    const document = await Promise.all(docs.map(prepareDocument));
    return document;
  } catch (error) {
    console.log("error at loadPdfToPinecone", error);
    return "";
  }
};

export const truncateStringByBytes = (str: string, bytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  try {
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
  } catch (err) {
    throw err;
  }
}
