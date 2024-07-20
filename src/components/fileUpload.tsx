"use client";
import { InboxIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import axios, { AxiosResponse } from "axios";

import UploadFile from "@/lib/uploadFIle";
import { embedDocument } from "@/lib/embeding";
import { uploadDataToPinecone } from "@/lib/pinecone";
import { useRouter } from "next/navigation";

interface UploadToPineconeResponse {
  chat_id: string;
}

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
        setMessage("creating vectors");
        const vectors = await Promise.all(docs.map(embedDocument));
        setMessage("uploading to Pinecone");
        await uploadDataToPinecone(vectors, response.$id);
        setMessage("creating chat enviornment");
        const { data } = await axios.post<UploadToPineconeResponse>(
          "/api/upload-to-pinecone",
          {
            fileId: response.$id,
            fileName: response.name,
          }
        );

        router.push(`/chat/${data.chat_id}`);
      } catch (error: any) {
        toast.error(error.message || "something went wrong");
        console.log(error);
      } finally {
        setProcessing(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
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
