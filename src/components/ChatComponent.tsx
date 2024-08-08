"use client";
import React, { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import MessageList from "./MessageList";

import { Send } from "lucide-react";
import { getEmbeddings } from "@/lib/embeding";
import axios from "axios";
import { getContext } from "@/lib/context";

interface Props {
  fileId?: string;
}

interface Message {
  role: string;
  content: string;
}

const ChatComponent = ({ fileId }: Props) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const inputVal = input;
      setIsLoading(true);
      setInput("");
      setMessage((pre) => [...pre, { role: "user", content: inputVal }]);
      let queryEmbedding = await getEmbeddings(inputVal);
      if (!queryEmbedding) throw new Error("problem creating embedding");

      const {
        success,
        data: context,
        error,
      } = await getContext(queryEmbedding, fileId!);
      if (!success) throw new Error(error);

      const chatResponse = await axios.post("/api/chat", {
        fileId,
        context,
        messages: [...messages, { role: "user", content: inputVal }],
      });

      setMessage((pre) => [
        ...pre,
        { role: "assistant", content: chatResponse.data.message },
      ]);
    } catch (error: any) {
      toast.error(error.messages || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-white relative h-full p-4">
      <div className="h-[90%] my-4 bg-gray-700 rounded-lg p-4 no-scrollbar">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <form
        className="flex justify-center items-start h-[10%]"
        onSubmit={submit}
      >
        <div className="flex w-full">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="ask any question"
            className="w-full text-black"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
