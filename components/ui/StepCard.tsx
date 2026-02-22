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
    <div className="relative">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <div className="w-12 h-12 rounded-full bg-[#f6175d] text-white flex items-center justify-center text-xl font-semibold shadow-md">
          {number}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-8 pt-12 shadow-sm border border-[#f9bd78]/40 hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold text-text mb-3 text-center">{title}</h3>
        <p className="text-text/80 text-center leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
