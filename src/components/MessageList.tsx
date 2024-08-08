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
    <div className="w-full h-full overflow-y-scroll flex flex-col-reverse no-scrollbar">
      {isLoading && (
        <div className="bg-gray-500 animate-pulse w-1/2 min-h-10 rounded-md mt-4" />
      )}
      {messages.toReversed().map((messages, index) => {
        return (
          <div
            key={index}
            className={cn("flex items-center my-4", {
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
    </div>
  );
};

export default MessageList;
