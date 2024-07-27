"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { InboxIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

import UploadFile from "@/lib/uploadFIle";
import { embedDocument } from "@/lib/embeding";
import { uploadDataToPinecone } from "@/lib/pinecone";

const FileUpload = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (file) => {
      if (file[0].size > 10 * 24 * 1024) {
        toast.error("File size grater that the allowed limit of 10mb");
        return;
      }
      try {
        setMessage("Uploading your file to cloud");
        setProcessing(true);
        const response = await UploadFile(file[0]);

        if (!response.$id || !response.name) {
          throw new Error("Error uploading file to cloud");
        }

        setMessage("Prossing your file");
        const { data: pdfData } = await axios.post(
          "/api/prepare-pdf-document",
          { fileId: response.$id }
        );

        if (!pdfData) {
          throw new Error("No PDF data found");
        }

        const docs = pdfData.data.flat();
        setMessage("Creating vectors");
        const vectors = await Promise.all(docs.map(embedDocument));
        setMessage("Uploading to Pinecone");
        const pineconeNameSpace = await uploadDataToPinecone(
          vectors,
          response.$id
        );
        setMessage("Creating chat enviornment");
        router.push(`/chat/${pineconeNameSpace}`);
      } catch (error: any) {
        toast.error(error.message || "something went wrong");
        console.log(error);
      } finally {
        setProcessing(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl w-full">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 flex justify-center items-center flex-col min-h-32",
        })}
      >
        <input {...getInputProps()} />
        {processing ? (
          <>
            <Loader className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-3 text-sm text-slate-400">{message}</p>
          </>
        ) : (
          <>
            <InboxIcon className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop your PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
