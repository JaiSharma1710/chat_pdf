import FileUpload from "@/components/fileUpload";
import { UserButton, SignedIn } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-end p-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <FileUpload />
    </div>
  );
};

export default Dashboard;
