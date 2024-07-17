const axios = require("axios");

const API_URL =
  "https://api-inference.huggingface.co/pipeline/feature-extraction/intfloat/multilingual-e5-large";

export async function getEmbeddings(text: string) {
  try {
    const response = await axios.post(
      API_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching embeddings:", error);
  }
}
