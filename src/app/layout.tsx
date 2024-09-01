import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Image from "next/image";

import Logo from "../../public/chatPdf.png";

import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chat PDF AI",
  description: "An AI powered application where you can upload you PDF's and create custom chatbot's for your pdf's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-rose-100 to-teal-100">
        <Toaster />
        <div className="shadow-md">
        <Link
          href="/"
          className="flex items-center cursor-pointer w-max"
        >
          <Image
            alt="logo"
            className="h-auto w-24 px-4"
            src={Logo}
            width={500}
            height={500}
          />
          <p className="font-bold text-2xl">ChatPDF.ai</p>
        </Link>
        </div>
        {children}
      </body>
    </html>
  );
}
