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
