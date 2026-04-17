export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-lg space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Turn your ideas into<span className="block text-purple-300">cinematic films</span>
          </h1>
          <p className="text-lg text-purple-200/70 leading-relaxed">
            Describe a story. AI creates characters, writes the screenplay, builds a storyboard,
            and renders a full movie with dialogue and music.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
