import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="w-screen min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat With Any PDF</h1>
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join Millions of Students, researchers and Professionals to
            instantly answer question and understand reasearch with AI
          </p>

          <div className="w-full mt-4">
            {!!user ? (
              <Link href="/dashboard">
                <Button>
                  Go to dashboard <LogIn className="ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button>
                  Login to get started <LogIn className="ml-2" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
