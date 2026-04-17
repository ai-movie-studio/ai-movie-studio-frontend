import Link from "next/link";
import { Film, Sparkles, Users, Image, Video, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/10">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><Film className="size-6 text-purple-500" /><span className="font-bold text-lg">AI Movie Studio</span></div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium">Get Started</Link>
        </div>
      </header>
      <section className="px-6 py-24 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm"><Sparkles className="size-3.5" /> Powered by AI</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">Turn your ideas into<br /><span className="text-purple-500">cinematic short films</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Just describe your movie idea. AI generates characters, writes the screenplay, creates storyboards, and renders a complete video with dialogue and music.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium">Start Creating <ArrowRight className="size-4" /></Link>
      </section>
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center tracking-tight mb-12">From idea to movie in minutes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Users className="size-6" />, title: "1. Describe your idea", desc: "Tell us your story. AI generates characters with unique looks, personalities, and dialogue styles." },
            { icon: <Image className="size-6" />, title: "2. Review storyboard", desc: "See every scene as a still image. Edit, tweak, regenerate — images are cheap. Iterate here." },
            { icon: <Video className="size-6" />, title: "3. Render your movie", desc: "AI generates video with spoken dialogue and sound. Download your finished film." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border border-border bg-card/50 space-y-3">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500 w-fit">{item.icon}</div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
