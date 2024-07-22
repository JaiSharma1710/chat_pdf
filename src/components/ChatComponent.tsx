"use client";
import React, { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

interface Props {
  fileId?: string;
}

const getUserChat = (msg: string) => ({ role: "user", content: msg });
const getAiChat = (msg: string) => ({ role: "assistant", content: msg });

const 

const ChatComponent = ({ fileId }: Props) => {
  const [messages, setMessage] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(input);
    setInput("");
  };

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  return (
    <div className="text-white relative h-full overflow-y-scroll">
      <div className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList messages={messages} />

      <form
        className="sticky bottom-0 inset-x-0 px-2 py-4"
        onSubmit={handleSubmit}
      >
        <div className="flex">
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
