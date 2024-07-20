"use client";
import { InboxIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axios from "axios";

import UploadFile from "@/lib/uploadFIle";
import { embedDocument } from "@/lib/embeding";
import { uploadDataToPinecone } from "@/lib/pinecone";

type mutationFnProps = {
  fileName: string;
  fileId: string;
};

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ fileName, fileId }: mutationFnProps) => {
      const response = await axios.post("/api/prepare-pdf-document", {
        fileName,
        fileId,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (file) => {
      if (file[0].size > 10 * 24 * 1024) {
        toast.error("File size grater that the allowed limit of 10mb");
        return;
      }
      try {
        setUploading(true);
        const response = await UploadFile(file[0]);
        if (!response.$id || !response.name) {
          toast.error("something went wrong");
          return;
        }
        mutate(
          { fileId: response.$id, fileName: response.name },
          {
            onSuccess: async (data) => {
              toast.success("successfully uploaded your files");
              if (data) {
                const docs = data.data.flat();
                const vectors = await Promise.all(docs.map(embedDocument));
                await uploadDataToPinecone(vectors, response.$id);
              } else {
                throw new Error("something went wrong");
              }
            },
            onError: (error) => {
              console.log(error);
              toast.error("Error creating chat");
            },
          }
        );
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
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
        {isPending || uploading ? (
          <>
            <Loader className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-3 text-sm text-slate-400">
              Uploading your file to cloud
            </p>
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
