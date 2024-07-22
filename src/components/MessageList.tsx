import { cn } from "@/lib/utils";
// import { Message } from "ai/react";
import React from "react";

interface Props {
  messages: { role: string; content: string }[];
}

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>;

  return (
    <div className="flex flex-col gap-2 px-4">
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
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                {
                  "bg-blue-600 text-white": messages.role === "user",
                  "bg-white text-black": messages.role === "assistant",
                }
              )}
            >
              <p>{messages.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
