import PdfViewer from "@/components/PdfViewer";
import React from "react";
import ChatComponent from "../../../components/ChatComponent";
import { getAppwriteFileUrl } from "@/lib/uploadFIle";

interface Props {
  params: {
    fileId: string;
  };
}

const ChatPage = async ({ params: { fileId } }: Props) => {
  const pdfUrl = getAppwriteFileUrl(fileId);
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden pt-4">
      <div className="w-1/2">
        <PdfViewer pdfUrl={pdfUrl} /> 
      </div>
      <div className="w-1/2 bg-gray-900">
        <ChatComponent fileId={fileId} />
      </div>
    </div>
  );
};

export default ChatPage;
