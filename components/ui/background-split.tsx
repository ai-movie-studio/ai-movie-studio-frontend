"use client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface BackgroundSplitProps {
  className?: string;
  splitClassName?: string;
  children?: React.ReactNode;
  variant?: "diagonal" | "reverse-diagonal";
}

export const BackgroundSplit = ({
  className,
  splitClassName,
  children,
  variant = "diagonal",
}: BackgroundSplitProps) => {
  const isMobile = useIsMobile();
  
  const clipPathMap = {
    diagonal: isMobile ? "none" : "polygon(0 75%, 100% 45%, 100% 100%, 0 100%)",
    "reverse-diagonal": isMobile ? "none" : "polygon(0 45%, 100% 75%, 100% 100%, 0 100%)",
  };

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* Background layer */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
        <div 
          className={cn("bg-white h-full w-full", splitClassName, isMobile && "h-screen")} 
          style={{ clipPath: clipPathMap[variant], height: isMobile ? "100vh" : "100vh" }}
        />
      </div>
      <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-0">
        {children}
      </div>
    </div>
  );
};
