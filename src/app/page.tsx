import FileUpload from "@/components/fileUpload";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="w-screen min-h-screen">
      <div className="flex p-4 justify-end">
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat With Any PDF</h1>
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join Millions of Students, researchers and Professionals to
            instantly answer question and understand reasearch with AI
          </p>

          <FileUpload IsLoggedIn={!!user} />
        </div>
      </div>
    </div>
  );
}
