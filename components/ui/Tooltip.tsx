import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  align?: "top" | "bottom";
  className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children, align = "top", className }) => {
  const positionClasses = align === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 ${positionClasses} w-64 max-w-xs whitespace-pre-wrap rounded-md bg-zinc-900 px-3 py-2 text-xs text-white text-left leading-relaxed shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100`}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
