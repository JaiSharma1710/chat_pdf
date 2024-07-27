import { getMatchesFromEmbeddings } from "./pinecone";

export async function getContext(queryEmbeddings: any, fileId: string) {
  try {
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileId);
    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.7
    );

    type Metadata = {
      text: string;
      pageNumber: number;
    };

    let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

    return {
      success: true,
      data: docs.join("\n").substring(0, 3000),
      error: "",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "failed fetching data from Pinecone",
      data: "",
    };
  }
}
