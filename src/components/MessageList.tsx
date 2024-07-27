import { cn } from "@/lib/utils";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  messages: { role: string; content: string }[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: Props) => {
  if (!messages) return <></>;

  return (
    <div className="flex flex-col justify-end h-full gap-3 p-4">
      {messages.map((messages, index) => {
        return (
          <div
            key={index}
            className={cn("flex", {
              "justify-end": messages.role === "user",
              "justify-start": messages.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 w-1/2 min-h-10 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": messages.role === "user",
                  "bg-white text-black": messages.role === "assistant",
                }
              )}
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {messages.content}
              </Markdown>
            </div>
          </div>
        );
      })}
      {isLoading && (
        <div className="bg-gray-500 animate-pulse w-1/2 min-h-10 rounded-md" />
      )}
    </div>
  );
};

export default MessageList;
