import ChatSidebar from "@/components/ChatSidebar";
import PdfViewer from "@/components/PdfViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  params: {
    chatid: string;
  };
}

const ChatPage = async ({ params: { chatid } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatid));

  //   if (!_chats) {
  //     return redirect("/");
  //   }

  //   if (!_chats.find((chats) => chats.id === parseInt(chatid))) {
  //     return redirect("/");
  //   }

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="w-1/5">
        <ChatSidebar chats={_chats} chatId={parseInt(chatid)} />
      </div>
      <div className="p-4 overflow-y-scroll w-3/5">
        <PdfViewer pdfUrl={currentChat?.pdfUrl} />
      </div>
      <div className="w-1/5 border-l-4 bg-gray-900 border-l-slate-200">
        {/* <ChatComponent/> */}
      </div>
    </div>
  );
};

export default ChatPage;
