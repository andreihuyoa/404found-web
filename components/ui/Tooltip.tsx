import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  align?: "top" | "bottom";
  side?: "center" | "left" | "right";
  className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  align = "top",
  side = "center",
  className,
}) => {
  const verticalClasses =
    align === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const horizontalClasses =
    side === "right"
      ? "right-0"
      : side === "left"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <span className={`group relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-20 ${verticalClasses} ${horizontalClasses} w-64 max-w-xs rounded-md bg-zinc-900 px-3 py-2 text-left text-xs leading-relaxed whitespace-pre-wrap text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100`}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
