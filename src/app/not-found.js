import Link from "next/link";
import { RiArrowLeftLine, RiSparklingFill } from "react-icons/ri";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <RiSparklingFill className="text-primary-500 text-3xl" />
        </div>
        <h1 className="font-display font-extrabold text-7xl text-primary-600 mb-3">404</h1>
        <h2 className="font-display font-bold text-2xl text-ink mb-3">Page not found</h2>
        <p className="text-ink-muted text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary gap-1.5"><RiArrowLeftLine /> Back to Home</Link>
          <Link href="/prompts" className="btn-outline">Browse Prompts</Link>
        </div>
      </div>
    </div>
  );
}
