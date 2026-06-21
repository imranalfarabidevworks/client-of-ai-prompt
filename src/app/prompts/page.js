import { Suspense } from "react";
import AllPromptsClient from "./AllPromptsClient";

export default function AllPromptsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <AllPromptsClient />
    </Suspense>
  );
}
