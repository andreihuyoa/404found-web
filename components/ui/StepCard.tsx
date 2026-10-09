export default function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative h-full">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6175d] text-base font-semibold text-white shadow-md sm:h-11 sm:w-11 sm:text-lg lg:h-12 lg:w-12 lg:text-xl">
          {number}
        </div>
      </div>
      <div className="h-full rounded-2xl border border-[#f9bd78]/40 bg-white p-5 pt-10 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-6 sm:pt-11 lg:p-8 lg:pt-12">
        <h3 className="text-text mb-2 text-center text-base font-semibold sm:mb-3 sm:text-lg lg:text-xl">
          {title}
        </h3>
        <p className="text-text/80 text-center text-xs leading-relaxed sm:text-sm lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
