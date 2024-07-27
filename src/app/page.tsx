import FileUpload from "@/components/fileUpload";

export default async function Home() {
  return (
    <div className="w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat With Any PDF</h1>
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join Millions of Students, researchers and Professionals to
            instantly answer question and understand reasearch with AI
          </p>
          <FileUpload />
        </div>
      </div>
    </div>
  );
}
