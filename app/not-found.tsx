import Link from "next/link";
import { Film, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <Film className="size-14 text-purple-500/30 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-base text-muted-foreground">Page not found. The scene you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Link href="/projects"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
          <ArrowLeft className="size-4" /> Back to projects
        </Link>
      </div>
    </div>
  );
}
