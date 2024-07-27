"use client";
import React, { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

interface Props {
  fileId?: string;
}

// const getUserChat = (msg: string) => ({ role: "user", content: msg });
// const getAiChat = (msg: string) => ({ role: "assistant", content: msg });

const ChatComponent = ({ fileId }: Props) => {
  // const [messages, setMessage] = useState([]);
  // const [input, setInput] = useState("");

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   console.log(input);
  //   setInput("");
  // };

  // const handleInputChange = (e: any) => {
  //   setInput(e.target.value);
  // };

  return (
    <div className="text-white relative h-full p-4">
      <div className="h-[90%] my-4 bg-gray-700 rounded-lg"></div>
      <form
        className="flex justify-center items-start h-[10%]"
        // onSubmit={handleSubmit}
      >
        <div className="flex w-full">
          <Input
            // value={input}
            // onChange={handleInputChange}
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
