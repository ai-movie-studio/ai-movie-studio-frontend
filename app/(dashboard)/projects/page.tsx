import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { BackgroundSplit } from "@/components/ui/background-split";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, LogOut, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background with Animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <BackgroundGradientAnimation
          containerClassName="h-full w-full"
          className="z-0"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nabula</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <LayoutDashboard className="w-5 h-5 text-gray-600" />
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-red-600 hover:bg-red-50 gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Your Projects</h2>
              <p className="text-gray-500 mt-2 text-lg">Manage and create your AI movie studio projects</p>
            </div>
            <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </div>

          {/* Empty State Mock */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-100" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mb-6">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Project Name {i}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    A beautiful description placeholder for your amazing AI movie project.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                      Draft
                    </span>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
