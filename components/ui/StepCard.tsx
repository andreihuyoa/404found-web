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
        <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#f6175d] text-white flex items-center justify-center text-base sm:text-lg lg:text-xl font-semibold shadow-md">
          {number}
        </div>
      </div>
      <div className="h-full bg-white rounded-2xl p-5 sm:p-6 lg:p-8 pt-10 sm:pt-11 lg:pt-12 shadow-sm border border-[#f9bd78]/40 hover:shadow-lg transition-all duration-300">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-text mb-2 sm:mb-3 text-center">
          {title}
        </h3>
        <p className="text-xs sm:text-sm lg:text-base text-text/80 text-center leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
