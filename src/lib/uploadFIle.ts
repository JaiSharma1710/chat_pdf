import { Client, Storage, ID } from "appwrite";

export default function UploadFile(file: any) {
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  const storage = new Storage(client);

  return storage.createFile(
    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
    ID.unique(),
    file
  );
}

export function getAppwriteFileUrl(fileID: string) {
  return `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${fileID}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;
}
