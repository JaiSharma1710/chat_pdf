import { UserButton, SignedIn } from "@clerk/nextjs";
import React from "react";

const Dashboard = () => {
  return (
    <div className="flex justify-end p-4">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Dashboard;
