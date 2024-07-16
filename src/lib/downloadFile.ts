import axios from "axios";
import fs from "fs";
import path from "path";

export async function downloadFileFromAppWrite(fileID: string) {
  try {
    // Axios configuration
    const axiosInstance = axios.create({
      baseURL: "https://cloud.appwrite.io/v1/storage", // Adjust base URL as per your setup
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY, // Example: Replace with your Appwrite API key
      },
    });

    // Fetch the file using Axios
    const response = await axiosInstance.get(
      `/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileID}/view`,
      {
        responseType: "arraybuffer",
        params: {
          project: process.env.NEXT_PUBLIC_PROJECT_ID,
        },
      }
    );

    const buffer = Buffer.from(response.data);

    // Create temp/pdf directory if not exists
    const tempDir = path.join(process.cwd(), "src", "files");
    await fs.promises.mkdir(tempDir, { recursive: true });

    // Generate unique file name
    const fileName = `${Date.now()}.pdf`;
    const filePath = path.join(tempDir, fileName);

    // Write buffer to file
    fs.writeFileSync(filePath, buffer);

    console.log(`File downloaded and saved to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error; // Propagate the error up to the caller
  }
}
