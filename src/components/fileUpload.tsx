"use client";
import UploadFile from "@/lib/uploadFIle";
import { InboxIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (file) => {
      UploadFile(file[0]).then(
        function (response) {
          console.log(response); // Success
        },
        function (error) {
          console.log(error); // Failure
        }
      );
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
        <>
          <InboxIcon className="w-10 h-10 text-blue-500" />
          <p className="mt-2 text-sm text-slate-400">Drop your PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
